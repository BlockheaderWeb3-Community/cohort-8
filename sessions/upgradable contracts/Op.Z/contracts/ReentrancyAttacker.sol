// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Staking.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReentrancyAttacker {
    StakingPoolUpgradeable public pool;

    constructor(address poolAddress) {
        pool = StakingPoolUpgradeable(poolAddress);
    }

    function tryWithdraw(uint256 amount) external {
        pool.withdraw(amount);
    }

    function attackStake(uint256 amount) external {
        address token = address(pool.stakingToken());
        IERC20(token).approve(address(pool), amount);
        pool.stake(amount);
    }
}

