// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity ^0.8.31;

contract ERC20 {
  string public name;
  string public symbol;
  uint8 public decimals;

  uint256 private _totalSupply;

  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _initialSupply
  ) {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;

    // FIX: mint initial supply to deployer
    if (_initialSupply > 0) {
      _mint(msg.sender, _initialSupply);
    }
  }

  function totalSupply() external view returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address _account) external view returns (uint256) {
    return _balances[_account];
  }

  function allowance(
    address _owner,
    address _spender
  ) external view returns (uint256) {
    return _allowances[_owner][_spender];
  }

  // FIX: removed bogus `returns (uint256)`, visibility is internal (was private — too restrictive)
  function _transfer(address _from, address _to, uint256 _amount) internal {
    require(_to != address(0), 'transfer to zero address');

    uint256 senderBalance = _balances[_from];
    require(senderBalance >= _amount, 'insufficient funds');

    unchecked {
      _balances[_from] = senderBalance - _amount;
      _balances[_to] += _amount;
    }

    emit Transfer(_from, _to, _amount);
  }

  function _mint(address _account, uint256 _amount) internal {
    require(_account != address(0), 'cannot mint to zero address');

    _totalSupply += _amount;
    _balances[_account] += _amount;

    emit Transfer(address(0), _account, _amount);
  }

  // FIX: use >= instead of > so burning exact balance is allowed
  // FIX: burn from zero-address check is pointless at runtime; kept for clarity
  // FIX: tokens destroyed — do NOT credit address(0)
  function _burn(uint256 _amount) internal {
    require(msg.sender != address(0), 'cannot call from address 0');
    require(_balances[msg.sender] >= _amount, 'insufficient funds');

    _balances[msg.sender] -= _amount;
    _totalSupply -= _amount;

    emit Transfer(msg.sender, address(0), _amount);
  }

  // FIX: renamed to `approve` (public-facing); removed leading underscore convention for external fns
  function approve(address _spender, uint256 _amount) external returns (bool) {
    _allowances[msg.sender][_spender] = _amount;
    emit Approval(msg.sender, _spender, _amount);
    return true;
  }

  // FIX: renamed to `transferFrom`
  function transferFrom(
    address _from,
    address _to,
    uint256 _amount
  ) external returns (bool) {
    uint256 currentAllowance = _allowances[_from][msg.sender];
    require(currentAllowance >= _amount, 'insufficient allowance');

    unchecked {
      _allowances[_from][msg.sender] = currentAllowance - _amount;
    }

    emit Approval(_from, msg.sender, _allowances[_from][msg.sender]);
    _transfer(_from, _to, _amount);
    return true;
  }

  function transfer(address _to, uint256 _amount) external returns (bool) {
    _transfer(msg.sender, _to, _amount);
    return true;
  }

  function mint(uint256 _amount) external returns (bool) {
    _mint(msg.sender, _amount);
    return true;
  }

  // Expose internal balance for child contracts
  function _balanceOf(address _account) internal view returns (uint256) {
    return _balances[_account];
  }
}

contract StakingProtocol is ERC20 {
  struct Pool {
    ERC20 stakingToken;
    ERC20 rewardToken;
    uint256 rewardRate;
    uint256 lockPeriod;
    uint256 penaltyBps;
    uint256 totalStaked;
    uint256 rewardPerTokenStored;
    uint256 lastUpdateTime;
    bool active;
  }

  struct UserInfo {
    uint256 staked;
    uint256 rewardPerTokenPaid;
    uint256 rewards;
    uint256 stakedAt;
  }

  address public owner;

  Pool[] private _pools;

  mapping(uint256 => mapping(address => UserInfo)) private _userInfo;

  event PoolCreated(
    uint256 indexed poolId,
    address stakingToken,
    address rewardToken,
    uint256 rewardRate,
    uint256 lockPeriod,
    uint256 penaltyBps
  );
  event Staked(uint256 indexed poolId, address indexed user, uint256 amount);
  event Withdrawn(
    uint256 indexed poolId,
    address indexed user,
    uint256 amount,
    uint256 penalty
  );
  event RewardsClaimed(
    uint256 indexed poolId,
    address indexed user,
    uint256 amount
  );
  event EmergencyWithdraw(
    uint256 indexed poolId,
    address indexed user,
    uint256 amount
  );
  event RewardRateUpdated(uint256 indexed poolId, uint256 newRate);
  event PoolStatusChanged(uint256 indexed poolId, bool active);

  modifier onlyOwner() {
    require(msg.sender == owner, 'not owner');
    _;
  }

  modifier validPool(uint256 poolId) {
    require(poolId < _pools.length, 'invalid pool');
    _;
  }

  modifier updateReward(uint256 poolId, address user) {
    Pool storage pool = _pools[poolId];

    pool.rewardPerTokenStored = _rewardPerToken(pool);
    pool.lastUpdateTime = block.timestamp;

    if (user != address(0)) {
      UserInfo storage info = _userInfo[poolId][user];
      info.rewards = _earned(pool, info);
      info.rewardPerTokenPaid = pool.rewardPerTokenStored;
    }
    _;
  }

  constructor() ERC20('StakingProtocol', 'SKP', 18, 0) {
    owner = msg.sender;
  }

  function createPool(
    address stakingToken,
    address rewardToken,
    uint256 rewardRate,
    uint256 lockPeriod,
    uint256 penaltyBps
  ) external onlyOwner returns (uint256 poolId) {
    require(stakingToken != address(0), 'zero staking token');
    require(rewardToken != address(0), 'zero reward token');
    require(penaltyBps <= 10_000, 'penalty > 100%');

    poolId = _pools.length;
    _pools.push(
      Pool({
        stakingToken: ERC20(stakingToken),
        rewardToken: ERC20(rewardToken),
        rewardRate: rewardRate,
        lockPeriod: lockPeriod,
        penaltyBps: penaltyBps,
        totalStaked: 0,
        rewardPerTokenStored: 0,
        lastUpdateTime: block.timestamp,
        active: true
      })
    );

    emit PoolCreated(
      poolId,
      stakingToken,
      rewardToken,
      rewardRate,
      lockPeriod,
      penaltyBps
    );
  }

  function setRewardRate(
    uint256 poolId,
    uint256 newRate
  ) external onlyOwner validPool(poolId) updateReward(poolId, address(0)) {
    _pools[poolId].rewardRate = newRate;
    emit RewardRateUpdated(poolId, newRate);
  }

  function setPoolActive(
    uint256 poolId,
    bool active
  ) external onlyOwner validPool(poolId) {
    _pools[poolId].active = active;
    emit PoolStatusChanged(poolId, active);
  }

  function stake(
    uint256 poolId,
    uint256 amount
  ) external validPool(poolId) updateReward(poolId, msg.sender) {
    require(amount > 0, 'cannot stake 0');

    Pool storage pool = _pools[poolId];
    UserInfo storage info = _userInfo[poolId][msg.sender];

    require(pool.active, 'pool is paused');

    pool.stakingToken.transferFrom(msg.sender, address(this), amount);

    pool.totalStaked += amount;
    info.staked += amount;
    info.stakedAt = block.timestamp;

    emit Staked(poolId, msg.sender, amount);
  }

  function withdraw(
    uint256 poolId,
    uint256 amount
  ) external validPool(poolId) updateReward(poolId, msg.sender) {
    require(amount > 0, 'cannot withdraw 0');

    Pool storage pool = _pools[poolId];
    UserInfo storage info = _userInfo[poolId][msg.sender];

    require(info.staked >= amount, 'over-withdraw');

    pool.totalStaked -= amount;
    info.staked -= amount;

    uint256 penalty = 0;
    if (
      pool.lockPeriod > 0 && block.timestamp < info.stakedAt + pool.lockPeriod
    ) {
      penalty = (amount * pool.penaltyBps) / 10_000;
    }

    uint256 net = amount - penalty;

    if (penalty > 0) {
      pool.stakingToken.transfer(owner, penalty);
    }
    pool.stakingToken.transfer(msg.sender, net);

    emit Withdrawn(poolId, msg.sender, net, penalty);
  }

  function claimRewards(
    uint256 poolId
  ) external validPool(poolId) updateReward(poolId, msg.sender) {
    UserInfo storage info = _userInfo[poolId][msg.sender];
    uint256 reward = info.rewards;

    require(reward > 0, 'no rewards');

    info.rewards = 0;
    _pools[poolId].rewardToken.transfer(msg.sender, reward);

    emit RewardsClaimed(poolId, msg.sender, reward);
  }

  function emergencyWithdraw(uint256 poolId) external validPool(poolId) {
    Pool storage pool = _pools[poolId];
    UserInfo storage info = _userInfo[poolId][msg.sender];

    uint256 amount = info.staked;
    require(amount > 0, 'nothing staked');

    pool.totalStaked -= amount;
    info.staked = 0;
    info.rewards = 0;
    info.rewardPerTokenPaid = pool.rewardPerTokenStored;

    uint256 penalty = 0;
    if (
      pool.lockPeriod > 0 && block.timestamp < info.stakedAt + pool.lockPeriod
    ) {
      penalty = (amount * pool.penaltyBps) / 10_000;
    }

    uint256 net = amount - penalty;

    if (penalty > 0) {
      pool.stakingToken.transfer(owner, penalty);
    }
    pool.stakingToken.transfer(msg.sender, net);

    emit EmergencyWithdraw(poolId, msg.sender, amount);
  }

  function poolCount() external view returns (uint256) {
    return _pools.length;
  }

  function getPool(
    uint256 poolId
  )
    external
    view
    validPool(poolId)
    returns (
      address stakingToken,
      address rewardToken,
      uint256 rewardRate,
      uint256 lockPeriod,
      uint256 penaltyBps,
      uint256 totalStaked,
      bool active
    )
  {
    Pool storage p = _pools[poolId];
    return (
      address(p.stakingToken),
      address(p.rewardToken),
      p.rewardRate,
      p.lockPeriod,
      p.penaltyBps,
      p.totalStaked,
      p.active
    );
  }

  function getUserInfo(
    uint256 poolId,
    address user
  )
    external
    view
    validPool(poolId)
    returns (
      uint256 staked,
      uint256 pendingRewards,
      uint256 stakedAt,
      bool locked
    )
  {
    Pool storage pool = _pools[poolId];
    UserInfo storage info = _userInfo[poolId][user];

    staked = info.staked;
    pendingRewards = _earned(pool, info);
    stakedAt = info.stakedAt;
    locked =
      pool.lockPeriod > 0 &&
      block.timestamp < info.stakedAt + pool.lockPeriod;
  }

  function _rewardPerToken(Pool storage pool) internal view returns (uint256) {
    if (pool.totalStaked == 0) {
      return pool.rewardPerTokenStored;
    }
    uint256 elapsed = block.timestamp - pool.lastUpdateTime;
    return
      pool.rewardPerTokenStored +
      (elapsed * pool.rewardRate * 1e18) /
      pool.totalStaked;
  }

  function _earned(
    Pool storage pool,
    UserInfo storage info
  ) internal view returns (uint256) {
    return
      info.rewards +
      (info.staked * (_rewardPerToken(pool) - info.rewardPerTokenPaid)) /
      1e18;
  }
}
