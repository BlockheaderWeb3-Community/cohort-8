// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.28;

import "./erc20.sol";

/**
 * @title StakingPool
 * @dev Individual staking pool for a specific token
 */
contract StakingPool {
    // The staking token
    ERC20 public stakingToken;
    // The reward token
    ERC20 public rewardToken;
    
    // Pool parameters
    uint256 public rewardRate; // Rewards per second
    uint256 public lockPeriod; // Lock period in seconds
    uint256 public penaltyRate; // Penalty percentage (in basis points, e.g., 1000 = 10%)
    
    // Pool state
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalStaked;
    
    // User data
    struct UserInfo {
        uint256 amount; // Staked amount
        uint256 rewardDebt; // Reward debt for calculation
        uint256 pendingRewards; // Accumulated pending rewards
        uint256 stakeTime; // Timestamp when staked
        uint256 lastClaimTime; // Last time user claimed rewards
    }
    
    mapping(address => UserInfo) public userInfo;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty);
    event RewardsClaimed(address indexed user, uint256 amount);
    event EmergencyWithdrawn(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event LockPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);
    event PenaltyRateUpdated(uint256 oldRate, uint256 newRate);
    
    // Modifiers
    modifier updateReward(address account) {
        _updateReward(account);
        _;
    }
    
    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate,
        uint256 _lockPeriod,
        uint256 _penaltyRate
    ) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardToken != address(0), "Invalid reward token");
        require(_penaltyRate <= 10000, "Penalty rate too high"); // Max 100%
        
        stakingToken = ERC20(_stakingToken);
        rewardToken = ERC20(_rewardToken);
        rewardRate = _rewardRate;
        lockPeriod = _lockPeriod;
        penaltyRate = _penaltyRate;
        lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Calculate reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + (
            (block.timestamp - lastUpdateTime) * rewardRate * 1e18 / totalStaked
        );
    }
    
    /**
     * @dev Calculate earned rewards for a user
     */
    function earned(address account) public view returns (uint256) {
        UserInfo storage user = userInfo[account];
        uint256 rewardPerTokenValue = rewardPerToken();
        return user.pendingRewards + (
            user.amount * (rewardPerTokenValue - user.rewardDebt) / 1e18
        );
    }
    
    /**
     * @dev Internal function to update reward state
     */
    function _updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            UserInfo storage user = userInfo[account];
            user.pendingRewards = earned(account);
            user.rewardDebt = rewardPerTokenStored;
        }
    }
    
    /**
     * @dev Stake tokens into the pool
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        // Transfer tokens from user to pool
        require(
            stakingToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        UserInfo storage user = userInfo[msg.sender];
        
        // If user already has stake, claim pending rewards first
        if (user.amount > 0) {
            uint256 pending = user.pendingRewards + (
                user.amount * (rewardPerTokenStored - user.rewardDebt) / 1e18
            );
            user.pendingRewards = pending;
        }
        
        user.amount += amount;
        user.stakeTime = block.timestamp;
        user.rewardDebt = rewardPerTokenStored;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw staked tokens
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= amount, "Insufficient staked balance");
        require(amount > 0, "Cannot withdraw 0");
        
        uint256 penalty = 0;
        
        // Check if lock period has passed
        if (block.timestamp < user.stakeTime + lockPeriod) {
            // Apply penalty for early withdrawal
            penalty = amount * penaltyRate / 10000;
        }
        
        uint256 withdrawAmount = amount - penalty;
        
        // Update state before transfer
        user.amount -= amount;
        user.rewardDebt = rewardPerTokenStored;
        totalStaked -= amount;
        
        // Transfer staked tokens back to user
        require(
            stakingToken.transfer(msg.sender, withdrawAmount),
            "Transfer failed"
        );
        
        // If there's a penalty, send it to the contract owner or burn
        // For simplicity, we keep it in the contract as protocol fees
        // Alternatively, could transfer to a fee collector
        
        emit Withdrawn(msg.sender, withdrawAmount, penalty);
    }
    
    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        uint256 pending = earned(msg.sender);
        
        require(pending > 0, "No rewards to claim");
        
        user.pendingRewards = 0;
        user.lastClaimTime = block.timestamp;
        user.rewardDebt = rewardPerTokenStored;
        
        // Transfer reward tokens to user
        require(
            rewardToken.transfer(msg.sender, pending),
            "Reward transfer failed"
        );
        
        emit RewardsClaimed(msg.sender, pending);
    }
    
    /**
     * @dev Emergency withdraw - withdraw all staked tokens without claiming rewards
     * Applies penalty if within lock period
     */
    function emergencyWithdraw() external {
        UserInfo storage user = userInfo[msg.sender];
        uint256 amount = user.amount;
        
        require(amount > 0, "No stake to withdraw");
        
        uint256 penalty = 0;
        
        // Check if lock period has passed
        if (block.timestamp < user.stakeTime + lockPeriod) {
            penalty = amount * penaltyRate / 10000;
        }
        
        uint256 withdrawAmount = amount - penalty;
        
        // Reset user state
        user.amount = 0;
        user.pendingRewards = 0;
        user.rewardDebt = rewardPerTokenStored;
        totalStaked -= amount;
        
        // Transfer staked tokens
        require(
            stakingToken.transfer(msg.sender, withdrawAmount),
            "Transfer failed"
        );
        
        emit EmergencyWithdrawn(msg.sender, withdrawAmount);
    }
    
    /**
     * @dev Update reward rate (only callable by factory/owner)
     * @param newRate New reward rate per second
     */
    function setRewardRate(uint256 newRate) external {
        // In production, this should have access control
        // For simplicity, we'll implement a basic version
        _updateReward(address(0));
        
        uint256 oldRate = rewardRate;
        rewardRate = newRate;
        
        emit RewardRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Update lock period
     * @param newPeriod New lock period in seconds
     */
    function setLockPeriod(uint256 newPeriod) external {
        // In production, this should have access control
        uint256 oldPeriod = lockPeriod;
        lockPeriod = newPeriod;
        
        emit LockPeriodUpdated(oldPeriod, newPeriod);
    }
    
    /**
     * @dev Update penalty rate
     * @param newRate New penalty rate in basis points
     */
    function setPenaltyRate(uint256 newRate) external {
        // In production, this should have access control
        require(newRate <= 10000, "Penalty rate too high");
        
        uint256 oldRate = penaltyRate;
        penaltyRate = newRate;
        
        emit PenaltyRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Get user info
     */
    function getUserInfo(address user) external view returns (
        uint256 amount,
        uint256 pendingRewards,
        uint256 stakeTime,
        uint256 lastClaimTime,
        uint256 availableRewards
    ) {
        UserInfo storage info = userInfo[user];
        return (
            info.amount,
            info.pendingRewards,
            info.stakeTime,
            info.lastClaimTime,
            earned(user)
        );
    }
    
    /**
     * @dev Check if user can withdraw without penalty
     */
    function canWithdrawWithoutPenalty(address user) external view returns (bool) {
        UserInfo storage info = userInfo[user];
        return block.timestamp >= info.stakeTime + lockPeriod;
    }
    
    /**
     * @dev Get time remaining until lock expires
     */
    function timeUntilUnlock(address user) external view returns (uint256) {
        UserInfo storage info = userInfo[user];
        if (block.timestamp >= info.stakeTime + lockPeriod) {
            return 0;
        }
        return (info.stakeTime + lockPeriod) - block.timestamp;
    }
}


/**
 * @title StakingFactory
 * @dev Factory contract to create and manage multiple staking pools
 */
contract StakingFactory {
    address public owner;
    
    struct PoolInfo {
        address poolAddress;
        address stakingToken;
        address rewardToken;
        uint256 rewardRate;
        uint256 lockPeriod;
        uint256 penaltyRate;
        bool active;
    }
    
    mapping(uint256 => PoolInfo) public pools;
    mapping(address => uint256[]) public userPools; // User's staked pools
    uint256 public poolCount;
    
    event PoolCreated(
        uint256 indexed poolId,
        address indexed poolAddress,
        address stakingToken,
        address rewardToken,
        uint256 rewardRate,
        uint256 lockPeriod,
        uint256 penaltyRate
    );
    
    event PoolDeactivated(uint256 indexed poolId);
    event PoolActivated(uint256 indexed poolId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new staking pool
     */
    function createPool(
        address stakingToken,
        address rewardToken,
        uint256 rewardRate,
        uint256 lockPeriod,
        uint256 penaltyRate
    ) external onlyOwner returns (uint256 poolId, address poolAddress) {
        require(stakingToken != address(0), "Invalid staking token");
        require(rewardToken != address(0), "Invalid reward token");
        
        poolId = poolCount;
        
        StakingPool pool = new StakingPool(
            stakingToken,
            rewardToken,
            rewardRate,
            lockPeriod,
            penaltyRate
        );
        
        poolAddress = address(pool);
        
        pools[poolId] = PoolInfo({
            poolAddress: poolAddress,
            stakingToken: stakingToken,
            rewardToken: rewardToken,
            rewardRate: rewardRate,
            lockPeriod: lockPeriod,
            penaltyRate: penaltyRate,
            active: true
        });
        
        poolCount++;
        
        emit PoolCreated(
            poolId,
            poolAddress,
            stakingToken,
            rewardToken,
            rewardRate,
            lockPeriod,
            penaltyRate
        );
        
        return (poolId, poolAddress);
    }
    
    /**
     * @dev Get pool info
     */
    function getPool(uint256 poolId) external view returns (PoolInfo memory) {
        require(poolId < poolCount, "Pool does not exist");
        return pools[poolId];
    }
    
    /**
     * @dev Get all pools
     */
    function getAllPools() external view returns (PoolInfo[] memory) {
        PoolInfo[] memory allPools = new PoolInfo[](poolCount);
        for (uint256 i = 0; i < poolCount; i++) {
            allPools[i] = pools[i];
        }
        return allPools;
    }
    
    /**
     * @dev Deactivate a pool
     */
    function deactivatePool(uint256 poolId) external onlyOwner {
        require(poolId < poolCount, "Pool does not exist");
        pools[poolId].active = false;
        emit PoolDeactivated(poolId);
    }
    
    /**
     * @dev Activate a pool
     */
    function activatePool(uint256 poolId) external onlyOwner {
        require(poolId < poolCount, "Pool does not exist");
        pools[poolId].active = true;
        emit PoolActivated(poolId);
    }
    
    /**
     * @dev Update pool parameters
     */
    function updatePoolParams(
        uint256 poolId,
        uint256 newRewardRate,
        uint256 newLockPeriod,
        uint256 newPenaltyRate
    ) external onlyOwner {
        require(poolId < poolCount, "Pool does not exist");
        
        StakingPool pool = StakingPool(pools[poolId].poolAddress);
        
        if (newRewardRate != pools[poolId].rewardRate) {
            pool.setRewardRate(newRewardRate);
            pools[poolId].rewardRate = newRewardRate;
        }
        
        if (newLockPeriod != pools[poolId].lockPeriod) {
            pool.setLockPeriod(newLockPeriod);
            pools[poolId].lockPeriod = newLockPeriod;
        }
        
        if (newPenaltyRate != pools[poolId].penaltyRate) {
            pool.setPenaltyRate(newPenaltyRate);
            pools[poolId].penaltyRate = newPenaltyRate;
        }
    }
    
    /**
     * @dev Fund a pool with reward tokens
     */
    function fundPool(uint256 poolId, uint256 amount) external onlyOwner {
        require(poolId < poolCount, "Pool does not exist");
        
        PoolInfo storage poolInfo = pools[poolId];
        ERC20 rewardToken = ERC20(poolInfo.rewardToken);
        
        require(
            rewardToken.transferFrom(msg.sender, poolInfo.poolAddress, amount),
            "Transfer failed"
        );
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }
}
