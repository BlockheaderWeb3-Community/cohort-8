// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from "../libraries/LibDiamond.sol";

contract IncreaseCount {
    // Using the library to define the storage layout
    LibDiamond.DiamondStorage layout;

    // Function to increase the count by a specified value
    function increaseCount(uint256 value) external {
        layout.count += value;
    }

    function getCount() external view returns (uint256) {
        return layout.count;
    }
}
