// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title StakingPoolUpgradeable
 * @notice Single staking pool with time-based rewards, optional lock + early-withdraw penalty.
 * @dev Upgradeable (UUPS). Uses SafeERC20 and nonReentrant guards.
 */
contract StakingPoolUpgradeable is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    IERC20 public rewardToken;

    // Rewards configuration (Synthetix-style)
    uint256 public rewardRate; // reward tokens per second
    uint256 public rewardsDuration; // seconds
    uint256 public periodFinish; // timestamp
    uint256 public lastUpdateTime; // timestamp
    uint256 public rewardPerTokenStored; // 1e18 scaled

    // Lock/penalty configuration
    uint256 public lockPeriod; // seconds
    uint256 public penaltyRate; // basis points (10000 = 100%)
    address public feeCollector; // where penalties are sent; if 0, stays in contract

    // Staking state
    uint256 public totalStaked;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public stakeTime;

    // Rewards accounting per user
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    // Simple upgrade-safe reentrancy guard (OZ-like)
    uint256 private _reentrancyStatus;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty);
    event RewardPaid(address indexed user, uint256 reward);
    event EmergencyWithdrawn(address indexed user, uint256 amountReceived, uint256 penalty);
    event RewardsNotified(uint256 rewardAdded, uint256 duration, uint256 newRewardRate, uint256 periodFinish);
    event LockPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);
    event PenaltyRateUpdated(uint256 oldRate, uint256 newRate);
    event FeeCollectorUpdated(address indexed oldCollector, address indexed newCollector);
    event Swept(address indexed token, address indexed to, uint256 amount);

    error ZeroAmount();
    error InvalidToken();
    error InvalidPenaltyRate();
    error InvalidDuration();
    error RewardTooSmall();
    error NoRewards();
    error InsufficientStaked();
    error ActiveRewardPeriod();
    error CannotSweepStakingToken();
    error CannotSweepRewardTokenDuringPeriod();

    modifier updateReward(address account) {
        _updateReward(account);
        _;
    }

    modifier nonReentrant() {
        require(_reentrancyStatus != _ENTERED, "ReentrancyGuard: reentrant call");
        _reentrancyStatus = _ENTERED;
        _;
        _reentrancyStatus = _NOT_ENTERED;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _stakingToken,
        address _rewardToken,
        uint256 _lockPeriod,
        uint256 _penaltyRate,
        address _owner,
        address _feeCollector
    ) external initializer {
        if (_stakingToken == address(0) || _rewardToken == address(0)) revert InvalidToken();
        if (_penaltyRate > 10_000) revert InvalidPenaltyRate();
        if (_owner == address(0)) revert();

        __Ownable_init(_owner);
        __Pausable_init();

        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        lockPeriod = _lockPeriod;
        penaltyRate = _penaltyRate;
        feeCollector = _feeCollector;

        lastUpdateTime = block.timestamp;
        _reentrancyStatus = _NOT_ENTERED;
    }

    // --- Views ---

    function lastTimeRewardApplicable() public view returns (uint256) {
        uint256 finish = periodFinish;
        if (finish == 0) return block.timestamp;
        return block.timestamp < finish ? block.timestamp : finish;
    }

    function rewardPerToken() public view returns (uint256) {
        uint256 supply = totalStaked;
        if (supply == 0) return rewardPerTokenStored;

        uint256 dt = lastTimeRewardApplicable() - lastUpdateTime;
        return rewardPerTokenStored + ((dt * rewardRate * 1e18) / supply);
    }

    function earned(address account) public view returns (uint256) {
        uint256 perToken = rewardPerToken();
        return rewards[account] + ((balanceOf[account] * (perToken - userRewardPerTokenPaid[account])) / 1e18);
    }

    function canWithdrawWithoutPenalty(address account) external view returns (bool) {
        uint256 t = stakeTime[account];
        if (t == 0) return true;
        return block.timestamp >= t + lockPeriod;
    }

    function timeUntilUnlock(address account) external view returns (uint256) {
        uint256 t = stakeTime[account];
        if (t == 0) return 0;
        uint256 unlock = t + lockPeriod;
        if (block.timestamp >= unlock) return 0;
        return unlock - block.timestamp;
    }

    // --- Core actions ---

    function stake(uint256 amount)
        external
        nonReentrant
        whenNotPaused
        updateReward(msg.sender)
    {
        if (amount == 0) revert ZeroAmount();
        uint256 beforeBal = stakingToken.balanceOf(address(this));
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = stakingToken.balanceOf(address(this)) - beforeBal;
        if (received == 0) revert ZeroAmount();

        totalStaked += received;
        balanceOf[msg.sender] += received;
        stakeTime[msg.sender] = block.timestamp;

        emit Staked(msg.sender, received);
    }

    function withdraw(uint256 amount)
        external
        nonReentrant
        updateReward(msg.sender)
    {
        if (amount == 0) revert ZeroAmount();
        uint256 bal = balanceOf[msg.sender];
        if (bal < amount) revert InsufficientStaked();

        uint256 penalty = _penaltyFor(msg.sender, amount);

        balanceOf[msg.sender] = bal - amount;
        totalStaked -= amount;

        uint256 toUser = amount - penalty;
        if (penalty != 0) _payPenalty(penalty);

        stakingToken.safeTransfer(msg.sender, toUser);
        emit Withdrawn(msg.sender, toUser, penalty);
    }

    function claimRewards()
        external
        nonReentrant
        updateReward(msg.sender)
    {
        uint256 reward = rewards[msg.sender];
        if (reward == 0) revert NoRewards();

        rewards[msg.sender] = 0;
        rewardToken.safeTransfer(msg.sender, reward);
        emit RewardPaid(msg.sender, reward);
    }

    /**
     * @notice Withdraw all stake without claiming rewards.
     * @dev Penalty applies if within lock period. Rewards are forfeited.
     */
    function emergencyWithdraw() external nonReentrant {
        uint256 amount = balanceOf[msg.sender];
        if (amount == 0) revert ZeroAmount();

        uint256 penalty = _penaltyFor(msg.sender, amount);

        // Effects
        totalStaked -= amount;
        balanceOf[msg.sender] = 0;
        rewards[msg.sender] = 0;
        userRewardPerTokenPaid[msg.sender] = rewardPerToken();

        uint256 toUser = amount - penalty;
        if (penalty != 0) _payPenalty(penalty);

        stakingToken.safeTransfer(msg.sender, toUser);
        emit EmergencyWithdrawn(msg.sender, toUser, penalty);
    }

    // --- Admin ---

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setLockPeriod(uint256 newPeriod) external onlyOwner {
        uint256 old = lockPeriod;
        lockPeriod = newPeriod;
        emit LockPeriodUpdated(old, newPeriod);
    }

    function setPenaltyRate(uint256 newRate) external onlyOwner {
        if (newRate > 10_000) revert InvalidPenaltyRate();
        uint256 old = penaltyRate;
        penaltyRate = newRate;
        emit PenaltyRateUpdated(old, newRate);
    }

    function setFeeCollector(address newCollector) external onlyOwner {
        address old = feeCollector;
        feeCollector = newCollector;
        emit FeeCollectorUpdated(old, newCollector);
    }

    /**
     * @notice Add rewards for a new distribution period.
     * @dev Owner must approve `rewardToken` to this contract beforehand.
     */
    function notifyRewardAmount(uint256 rewardAmount, uint256 duration)
        external
        onlyOwner
        updateReward(address(0))
    {
        if (duration == 0) revert InvalidDuration();
        if (rewardAmount == 0) revert RewardTooSmall();

        // Pull reward tokens in first, so balance checks are reliable.
        rewardToken.safeTransferFrom(msg.sender, address(this), rewardAmount);

        uint256 currentTime = block.timestamp;
        uint256 newRate;

        if (currentTime >= periodFinish) {
            newRate = rewardAmount / duration;
        } else {
            uint256 remaining = periodFinish - currentTime;
            uint256 leftover = remaining * rewardRate;
            newRate = (rewardAmount + leftover) / duration;
        }

        if (newRate == 0) revert RewardTooSmall();

        rewardRate = newRate;
        rewardsDuration = duration;
        lastUpdateTime = currentTime;
        periodFinish = currentTime + duration;

        emit RewardsNotified(rewardAmount, duration, newRate, periodFinish);
    }

    /**
     * @notice Sweep tokens accidentally sent to this contract.
     * @dev Cannot sweep stakingToken; cannot sweep rewardToken while an active reward period is running.
     */
    function sweep(address token, address to, uint256 amount) external onlyOwner {
        if (token == address(stakingToken)) revert CannotSweepStakingToken();
        if (token == address(rewardToken) && block.timestamp < periodFinish) {
            revert CannotSweepRewardTokenDuringPeriod();
        }
        IERC20(token).safeTransfer(to, amount);
        emit Swept(token, to, amount);
    }

    // --- Internals ---

    function _updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
    }

    function _penaltyFor(address account, uint256 amount) internal view returns (uint256) {
        if (penaltyRate == 0 || lockPeriod == 0) return 0;
        uint256 t = stakeTime[account];
        if (t == 0) return 0;
        if (block.timestamp >= t + lockPeriod) return 0;
        return (amount * penaltyRate) / 10_000;
    }

    function _payPenalty(uint256 penalty) internal {
        address collector = feeCollector;
        if (collector != address(0)) {
            stakingToken.safeTransfer(collector, penalty);
        }
        // else: keep inside contract (protocol fees)
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}

/**
 * @title StakingFactoryUpgradeable
 * @notice Creates upgradeable pool proxies and tracks them.
 * @dev Upgradeable (UUPS). Pools are deployed as ERC1967 proxies.
 */
contract StakingFactoryUpgradeable is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    address public poolImplementation;
    uint256 public poolCount;

    struct PoolInfo {
        address pool;
        address stakingToken;
        address rewardToken;
        uint256 lockPeriod;
        uint256 penaltyRate;
        address feeCollector;
        bool active;
    }

    mapping(uint256 => PoolInfo) public pools;

    event PoolImplementationUpdated(address indexed oldImpl, address indexed newImpl);
    event PoolCreated(
        uint256 indexed poolId,
        address indexed pool,
        address stakingToken,
        address rewardToken,
        uint256 lockPeriod,
        uint256 penaltyRate
    );
    event PoolActivated(uint256 indexed poolId);
    event PoolDeactivated(uint256 indexed poolId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner, address _poolImplementation) external initializer {
        if (_owner == address(0)) revert();
        __Ownable_init(_owner);
        _setPoolImplementation(_poolImplementation);
    }

    function setPoolImplementation(address newImpl) external onlyOwner {
        _setPoolImplementation(newImpl);
    }

    function createPool(
        address stakingToken,
        address rewardToken,
        uint256 lockPeriod,
        uint256 penaltyRate,
        address feeCollector
    ) external onlyOwner returns (uint256 poolId, address poolAddr) {
        if (stakingToken == address(0) || rewardToken == address(0)) revert();

        poolId = poolCount;

        bytes memory initData = abi.encodeWithSelector(
            StakingPoolUpgradeable.initialize.selector,
            stakingToken,
            rewardToken,
            lockPeriod,
            penaltyRate,
            owner(),
            feeCollector
        );
        poolAddr = address(new OZERC1967Proxy(poolImplementation, initData));

        pools[poolId] = PoolInfo({
            pool: poolAddr,
            stakingToken: stakingToken,
            rewardToken: rewardToken,
            lockPeriod: lockPeriod,
            penaltyRate: penaltyRate,
            feeCollector: feeCollector,
            active: true
        });

        poolCount = poolId + 1;

        emit PoolCreated(poolId, poolAddr, stakingToken, rewardToken, lockPeriod, penaltyRate);
    }

    function deactivatePool(uint256 poolId) external onlyOwner {
        pools[poolId].active = false;
        emit PoolDeactivated(poolId);
    }

    function activatePool(uint256 poolId) external onlyOwner {
        pools[poolId].active = true;
        emit PoolActivated(poolId);
    }

    function getPool(uint256 poolId) external view returns (PoolInfo memory) {
        require(poolId < poolCount, "Pool does not exist");
        return pools[poolId];
    }

    function getAllPools() external view returns (PoolInfo[] memory) {
        PoolInfo[] memory allPools = new PoolInfo[](poolCount);
        for (uint256 i = 0; i < poolCount; i++) {
            allPools[i] = pools[i];
        }
        return allPools;
    }

    function _setPoolImplementation(address newImpl) internal {
        if (newImpl == address(0)) revert();
        address old = poolImplementation;
        poolImplementation = newImpl;
        emit PoolImplementationUpdated(old, newImpl);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}

/**
 * @dev Included here to keep this project self-contained: ERC1967 proxy wrapper
 * with a stable artifact name usable by tests/factory.
 */
contract OZERC1967Proxy is ERC1967Proxy {
    constructor(address implementation, bytes memory data) ERC1967Proxy(implementation, data) {}
}