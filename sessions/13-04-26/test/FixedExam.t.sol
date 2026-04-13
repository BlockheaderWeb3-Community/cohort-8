// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {FixedExam} from "../src/FixedExam.sol";

contract Attacker {
    FixedExam private fixedExam;
    uint private amount;

    constructor(FixedExam _fixedExam) {
        fixedExam = _fixedExam;
    }

    function attack() external payable {
        amount = msg.value;
        fixedExam.deposit{value: msg.value}();
        fixedExam.withdraw(amount);
    }

    fallback() external payable {
        if (address(fixedExam).balance >= amount) {
            fixedExam.withdraw(amount);
        }
    }
}

//Fixed contract test
contract FixedExamTest is Test {
    FixedExam private fixedExam;
    Attacker private attacker;
    address public me;

    function setUp() public {
        fixedExam = new FixedExam();
        attacker = new Attacker(fixedExam);
        me = makeAddr("me");
        vm.deal(me, 1 ether);
    }

    function testAfterDeployment() public {
        assertEq(address(fixedExam).balance, 0);
    }

    function testDeposit() public {
        vm.prank(me);
        fixedExam.deposit{value: 1 ether}();
        assertEq(address(fixedExam).balance, 1 ether);
        assertEq(fixedExam.balances(me), 1 ether);
        assertEq(address(me).balance, 0);
    }

    function testWithdraw() public {
        vm.prank(me);
        fixedExam.deposit{value: 1 ether}();
        vm.prank(me);
        fixedExam.withdraw(1 ether);
        assertEq(address(fixedExam).balance, 0);
        assertEq(fixedExam.balances(me), 0);
        assertEq(address(me).balance, 1 ether);
    }

    function testFixedContractWorks() public {
        address victim = makeAddr("victim");
        vm.deal(victim, 10 ether);

        vm.prank(victim);
        fixedExam.deposit{value: 10 ether}();

        vm.expectRevert();
        attacker.attack{value: 1 ether}();

        assertEq(address(fixedExam).balance, 10 ether);
        assertEq(address(attacker).balance, 0);
    }
}
