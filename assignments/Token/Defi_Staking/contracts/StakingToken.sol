// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ERC20.sol";

contract StakingToken is ERC20 {
    constructor() ERC20("OwnerToken", "OTK", 18, 1000000 * 10**18) {}
}
