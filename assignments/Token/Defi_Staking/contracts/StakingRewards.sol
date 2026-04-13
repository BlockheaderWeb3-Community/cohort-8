// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract StakingRewards {
    IERC20 public stakingToken;
    address public owner;
    uint256 public rewardRate = 100;
    uint256 public lockPeriod = 7 days;
    uint256 public earlyWithdrawPenalty = 10; //10 percent
    
    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdateTime;
        uint256 stakeTime;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
        owner = msg.sender;
    }
    
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        
        _updateRewards(msg.sender);
        
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender].amount += amount;
        if (stakes[msg.sender].stakeTime == 0) {
            stakes[msg.sender].stakeTime = block.timestamp;
        }
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) external {
        require(amount > 0, "Cannot withdraw 0");
        require(stakes[msg.sender].amount >= amount, "Insufficient stake");
        
        _updateRewards(msg.sender);
        
        uint256 withdrawAmount = amount;
        if (block.timestamp < stakes[msg.sender].stakeTime + lockPeriod) {
            uint256 penalty = (amount * earlyWithdrawPenalty) / 100;
            withdrawAmount = amount - penalty;
        }
        
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        stakingToken.transfer(msg.sender, withdrawAmount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function claimRewards() external {
        _updateRewards(msg.sender);
        
        uint256 reward = stakes[msg.sender].rewardDebt;
        require(reward > 0, "No rewards");
        
        stakes[msg.sender].rewardDebt = 0;
        stakingToken.transfer(msg.sender, reward);
        
        emit RewardsClaimed(msg.sender, reward);
    }
    
    function emergencyWithdraw() external {
        uint256 amount = stakes[msg.sender].amount;
        require(amount > 0, "You didn't stake");
        
        stakes[msg.sender].amount = 0;
        stakes[msg.sender].rewardDebt = 0;
        stakes[msg.sender].lastUpdateTime = 0;
        stakes[msg.sender].stakeTime = 0;
        totalStaked -= amount;
        
        stakingToken.transfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, amount);
    }
    
    function updateRewardRate(uint256 newRate) external onlyOwner {
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }
    
    function earned(address account) public view returns (uint256) {
        Stake memory userStake = stakes[account];
        if (userStake.amount == 0) return userStake.rewardDebt;
        
        uint256 timeElapsed = block.timestamp - userStake.lastUpdateTime;
        uint256 newRewards = (userStake.amount * rewardRate * timeElapsed) / 1e18;
        return userStake.rewardDebt + newRewards;
    }
    
    function _updateRewards(address account) internal {
        stakes[account].rewardDebt = earned(account);
        stakes[account].lastUpdateTime = block.timestamp;
    }
}
