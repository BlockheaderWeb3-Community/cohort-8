// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


// This Interface acts as a bridge between this Defi Staking contract and my tokens contract,  
// showing this Defi Staking contract what functions to call. 
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns(bool);
    function transfer(address to, uint256 amount) external returns(bool);
    function balanceOf(address account) external view returns(uint256);
    function approve(address spender, uint256 amount) external returns(bool);
}


// this interface allows the use of mint and burn in this contract. 
// As mint and burn aren't standard ERC20, we create a seperate interface for the reciept token 
// becauee we will need to mint the token when staking and also to burn it when withdrawing
interface IRecieptToken {
    function mint(address to, uint256 amount) external returns(bool);
    function burn(address from, uint256 amount) external;
    function balanceOf(address account) external view returns(uint256);
}


contract DefiStaking {

    // stakeToken is of type of the interface. which gives this varaible the access to store an ERC20 token. 
    // samething goes with rewardToken.But for recieptToken, It's type is different because this very token has
    // it's own purpose set different than the others. 
    IERC20 public stakeToken; 
    IERC20 public rewardToken;
    IRecieptToken public recieptToken;


    // rewarsRate signifies how many reward tokens per second per token staked. 
    uint256 public rewardRate;

    // total token staked in the pool across all the users
    uint256 public totalStaked;

    // for admin functions
    address public owner;

    // how much each user staked
    mapping(address => uint256) public stakedBalance;
    // unclaimed reward per user
    mapping(address => uint256) public rewardBalance;
    // last time reward was calculated for user
    mapping(address => uint256) public lastUpdateTime;


    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);


    modifier onlyOwner() {
        require(msg.sender == owner, "unauthorized access");
        _;
    }

    constructor(address _stakedToken, address _rewardToken, address _recieptToken, uint256 _rewardRate) {
        stakeToken = IERC20(_stakedToken);
        rewardToken = IERC20(_rewardToken);
        recieptToken = IRecieptToken(_recieptToken);
        rewardRate = _rewardRate;
        owner = msg.sender;
    }


    // this is a helper function that looks at how long a user has been staking and how much they staked,
    // then returns how many rewards they've earned since the last time the rewards were updated 
    function calculateReward(address user) internal view returns(uint256) {
        if(stakedBalance[user] == 0) return 0;
        uint256 timeElapsed = block.timestamp - lastUpdateTime[user];

        uint256 rewards = stakedBalance[user] * rewardRate * timeElapsed / 1e18;
        return rewards;
    }

    // this updateReward modifier takes a snapshot at the pending rewards and saves them, the resets the timer
    modifier updateReward(address user) {
        rewardBalance[user] += calculateReward(user);
        lastUpdateTime[user] = block.timestamp;
        _;
    }


    // this view function returns user staked balance
    function getStakedBalance(address user) external view returns(uint256) {
        return stakedBalance[user];
    }

    // this view function returns the rewardBalance of user + calculateReward. 
    // Adding rewardBalance[user] + calculate(user) gives the updated reward of that user since the last update happened 
    function getPendingReward(address user) external view returns(uint256) {
        return rewardBalance[user] + calculateReward(user);
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Must Stake Token greater than Zero");

        stakeToken.transferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        totalStaked += amount;

        recieptToken.mint(msg.sender, amount);

        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0 && stakedBalance[msg.sender] >= amount, "Not Enough staked");
        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;

        recieptToken.burn(msg.sender, amount);
        stakeToken.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function claimRewards() external updateReward(msg.sender) {
        uint rewards = rewardBalance[msg.sender];
        require(rewards > 0, "Insufficient reward");

        rewardBalance[msg.sender] = 0;
        rewardToken.transfer(msg.sender, rewards);

        emit RewardsClaimed(msg.sender, rewards);
    }

    function emergencyWithdraw() external {
        uint amount = stakedBalance[msg.sender];
        require(amount > 0, "must be greater than zero");

        uint256 penalty = amount * 10/100;
        uint256 amountAfterPenalty = amount - penalty;

        stakedBalance[msg.sender] = 0;
        rewardBalance[msg.sender] =0;
        totalStaked -= amount;

        recieptToken.burn(msg.sender, amount);

        stakeToken.transfer(msg.sender, amountAfterPenalty);
        stakeToken.transfer(owner, penalty);

        emit EmergencyWithdraw(msg.sender, amount);
    }

    // Real Defi Protocol don't set rewards rate forever at deployment. 
    // Market condition changes. Token prices change.
    // This function gives the owner the ability to increase reward to attract more stakers,
    // and also to decrease reward to protcect the reward token supply
    function updateRewardRate(uint256 newRate) external onlyOwner {
        rewardRate = newRate;
    }

}