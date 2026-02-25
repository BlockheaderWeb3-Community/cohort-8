// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20.sol";

contract Staking {

    ERC20 public stakeToken;
    ERC20 public rewardToken;
    ERC20 public exchangeToken;

    uint256 public rewardRate;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalStaked;

    bool internal locked;

    mapping(address => uint256) public userStake;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    constructor(
        address _stakeToken,
        address _rewardToken,
        address _exchangeToken,
        uint256 _rewardRate
    ) {
        stakeToken = ERC20(_stakeToken);
        rewardToken = ERC20(_rewardToken);
        exchangeToken = ERC20(_exchangeToken);
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) return rewardPerTokenStored;

        return rewardPerTokenStored +
            ((block.timestamp - lastUpdateTime) * rewardRate * 1e18) /
            totalStaked;
    }

    function earned(address account) public view returns (uint256) {
        return
            (userStake[account] *
                (rewardPerToken() - userRewardPerTokenPaid[account])) /
            1e18 +
            rewards[account];
    }

    function stake(uint256 amount)
        external
        nonReentrant
        updateReward(msg.sender)
    {
        require(amount > 0, "Cannot stake 0");

        totalStaked += amount;
        userStake[msg.sender] += amount;

        stakeToken.transferFrom(msg.sender, address(this), amount);

        exchangeToken.mint(msg.sender, amount);
    }

    function withdraw(uint256 amount)
        external
        nonReentrant
        updateReward(msg.sender)
    {
        require(userStake[msg.sender] >= amount, "Insufficient stake");

        totalStaked -= amount;
        userStake[msg.sender] -= amount;

        exchangeToken.burnFrom(msg.sender, amount);

        stakeToken.transfer(msg.sender, amount);
    }

    function claimRewards()
        external
        nonReentrant
        updateReward(msg.sender)
    {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards");

        rewards[msg.sender] = 0;

        rewardToken.mint(msg.sender, reward);
    }
}