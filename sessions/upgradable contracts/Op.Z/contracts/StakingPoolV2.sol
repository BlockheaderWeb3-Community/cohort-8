// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Staking.sol";

/**
 * @dev Upgrade target used for testing the UUPS upgrade path.
 */
contract StakingPoolV2 is StakingPoolUpgradeable {
    function version() external pure returns (uint256) {
        return 2;
    }
}

