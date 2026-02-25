// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./token/ERC20.sol";


abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}


abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

interface IERC20Extended is IERC20 {
    function safeTransfer(address to, uint256 amount) external;
    function safeTransferFrom(address from, address to, uint256 amount) external;
}


contract StakingPool is Ownable, ReentrancyGuard {
    // Token interfaces
    IERC20Extended public stakingToken;
    IERC20Extended public rewardToken;

    // Pool state
    uint256 public rewardRate;
    uint256 public totalStaked;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    // User stake info
    struct UserInfo {
        uint256 stakedAmount;
        uint256 rewardDebt;
        uint256 rewardsClaimed;
        uint256 lockEndTime;
        uint256 firstStakeTime;
    }

    mapping(address => UserInfo) public userInfo;

    // Advanced features
    uint256 public lockPeriod; 
    uint256 public earlyWithdrawalPenalty;
    bool public emergencyWithdrawEnabled;
    uint256 public poolId;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    event LockPeriodUpdated(uint256 newLockPeriod);
    event PenaltyUpdated(uint256 newPenalty);
    event EmergencyWithdrawEnabled(bool enabled);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    /**
     * @dev Constructor
     * @param _stakingToken Address of the staking token
     * @param _rewardToken Address of the reward token
     * @param _rewardRate Initial reward rate (rewards per second per token)
     * @param _poolId ID for this pool (for multi-pool support)
     */
    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate,
        uint256 _poolId
    ) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardToken != address(0), "Invalid reward token");

        stakingToken = IERC20Extended(_stakingToken);
        rewardToken = IERC20Extended(_rewardToken);
        rewardRate = _rewardRate;
        poolId = _poolId;
        lastUpdateTime = block.timestamp;

        // Default lock period: 7 days
        lockPeriod = 7 days;
        // Default early withdrawal penalty: 10%
        earlyWithdrawalPenalty = 1000; // 10% = 1000/10000
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            UserInfo storage user = userInfo[account];
            user.rewardDebt = earned(account);
        }
        _;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        uint256 timeDelta = block.timestamp - lastUpdateTime;
        return rewardPerTokenStored + (timeDelta * rewardRate * 1e18) / totalStaked;
    }

    function earned(address account) public view returns (uint256) {
        UserInfo storage user = userInfo[account];
        uint256 rewardPerTokenAcc = rewardPerToken();
        uint256 userReward = (user.stakedAmount * rewardPerTokenAcc) / 1e18;
        return userReward - user.rewardDebt;
    }

    
    function pendingRewards(address account) public view returns (uint256) {
        UserInfo storage user = userInfo[account];
        uint256 rewardPerTokenAcc = rewardPerToken();
        uint256 userReward = (user.stakedAmount * rewardPerTokenAcc) / 1e18;
        return userReward - user.rewardDebt;
    }

    /**
     * @dev Stake tokens
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        require(
            stakingToken.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );

        UserInfo storage user = userInfo[msg.sender];

        // Transfer tokens from user
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Update user stake
        user.stakedAmount += amount;
        user.rewardDebt = (user.stakedAmount * rewardPerToken()) / 1e18;

        // Only extend lock period if staking more (don't reset)
        if (user.firstStakeTime == 0) {
            user.firstStakeTime = block.timestamp;
            user.lockEndTime = block.timestamp + lockPeriod;
        }

        // Update total staked
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Withdraw staked tokens
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        require(amount > 0, "Cannot withdraw 0");
        require(user.stakedAmount >= amount, "Insufficient staked amount");

        // Calculate penalty if withdrawing early
        uint256 penalty = 0;
        if (block.timestamp < user.lockEndTime) {
            penalty = (amount * earlyWithdrawalPenalty) / 10000;
        }

        // Update user info
        user.stakedAmount -= amount;
        user.rewardDebt = (user.stakedAmount * rewardPerTokenStored) / 1e18;

        // Update total staked
        totalStaked -= amount;

        // Transfer tokens back (minus penalty)
        if (penalty > 0) {
            stakingToken.safeTransfer(owner(), penalty); // Penalty goes to protocol owner
        }
        stakingToken.safeTransfer(msg.sender, amount - penalty);

        emit Withdrawn(msg.sender, amount, penalty);
    }

    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        uint256 reward = pendingRewards(msg.sender);

        require(reward > 0, "No rewards to claim");

        // Track claimed rewards
        user.rewardsClaimed += reward;
        user.rewardDebt = (user.stakedAmount * rewardPerTokenStored) / 1e18;

        // Transfer rewards
        rewardToken.safeTransfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @dev Withdraw stake and claim rewards in one transaction
     */
    function exit() external nonReentrant updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        uint256 amount = user.stakedAmount;
        uint256 reward = pendingRewards(msg.sender);

        require(amount > 0 || reward > 0, "Nothing to withdraw");

        // Calculate penalty if withdrawing early
        uint256 penalty = 0;
        if (amount > 0 && block.timestamp < user.lockEndTime) {
            penalty = (amount * earlyWithdrawalPenalty) / 10000;
        }

        // Reset user info
        user.stakedAmount = 0;
        user.rewardDebt = 0;
        user.rewardsClaimed = 0;

        // Update total staked
        totalStaked -= amount;

        // Transfer tokens
        if (amount > 0) {
            if (penalty > 0) {
                stakingToken.safeTransfer(owner(), penalty);
            }
            stakingToken.safeTransfer(msg.sender, amount - penalty);
        }

        if (reward > 0) {
            rewardToken.safeTransfer(msg.sender, reward);
        }

        emit Withdrawn(msg.sender, amount, penalty);
        if (reward > 0) {
            emit RewardClaimed(msg.sender, reward);
        }
    }

    /**
     * @dev Emergency withdraw (disables rewards)
     */
    function emergencyWithdraw() external nonReentrant {
        require(emergencyWithdrawEnabled, "Emergency withdraw not enabled");

        UserInfo storage user = userInfo[msg.sender];
        uint256 amount = user.stakedAmount;

        require(amount > 0, "Nothing to withdraw");

        // Reset user info but don't claim rewards
        user.stakedAmount = 0;
        user.rewardDebt = 0;

        // Update total
        totalStaked -= amount;

        // Transfer tokens
        stakingToken.safeTransfer(msg.sender, amount);

        emit EmergencyWithdraw(msg.sender, amount);
    }

    // ========== Admin Functions ==========

    /**
     * @dev Update reward rate
     * @param newRate New reward rate
     */
    function setRewardRate(uint256 newRate) external onlyOwner updateReward(address(0)) {
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    /**
     * @dev Set lock period
     * @param newLockPeriod New lock period in seconds
     */
    function setLockPeriod(uint256 newLockPeriod) external onlyOwner {
        lockPeriod = newLockPeriod;
        emit LockPeriodUpdated(newLockPeriod);
    }

    /**
     * @dev Set early withdrawal penalty
     * @param newPenalty New penalty (in basis points, e.g., 1000 = 10%)
     */
    function setPenalty(uint256 newPenalty) external onlyOwner {
        require(newPenalty <= 10000, "Penalty too high");
        earlyWithdrawalPenalty = newPenalty;
        emit PenaltyUpdated(newPenalty);
    }

    /**
     * @dev Enable/disable emergency withdraw
     * @param enabled Whether to enable emergency withdraw
     */
    function setEmergencyWithdrawEnabled(bool enabled) external onlyOwner {
        emergencyWithdrawEnabled = enabled;
        emit EmergencyWithdrawEnabled(enabled);
    }

    /**
     * @dev Fund the reward pool (owner deposits rewards)
     * @param amount Amount of reward tokens to deposit
     */
    function fundRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "Cannot fund 0");
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    // ========== View Functions ==========

    /**
     * @dev Get user info
     * @param user User address
     */
    function getUserInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 rewardsClaimed,
        uint256 lockEndTime,
        uint256 firstStakeTime
    ) {
        UserInfo storage u = userInfo[user];
        return (u.stakedAmount, u.rewardsClaimed, u.lockEndTime, u.firstStakeTime);
    }

    /**
     * @dev Get pool info
     */
    function getPoolInfo() external view returns (
        uint256 _totalStaked,
        uint256 _rewardRate,
        uint256 _lockPeriod,
        uint256 _penalty,
        bool _emergencyEnabled
    ) {
        return (totalStaked, rewardRate, lockPeriod, earlyWithdrawalPenalty, emergencyWithdrawEnabled);
    }
}
