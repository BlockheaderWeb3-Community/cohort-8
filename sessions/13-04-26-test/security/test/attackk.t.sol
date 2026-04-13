// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {SecureBank} from "../src/secureBank.sol";
import {AttackContract} from "../src/Attackk.sol";

contract AttackContractTest is Test {
    SecureBank bank;
    AttackContract attack;
    address user1;
    address attacker;

    function setUp() public {
        user1 = address(0x1);
        attacker = address(0x2);

        bank = new SecureBank();
        attack = new AttackContract(address(bank));

        vm.deal(user1, 10 ether);
        vm.prank(user1);
        bank.deposit{value: 10 ether}();
    }

    function testAttackReverts() public {
        vm.deal(attacker, 1 ether);
        vm.prank(attacker);
        vm.expectRevert("Transfer failed");
        attack.attack{value: 1 ether}();
    }

    function testFundsSafe() public {
        vm.deal(attacker, 1 ether);
        vm.prank(attacker);
        try attack.attack{value: 1 ether}() {} catch {}

        uint256 bankBalance = address(bank).balance;
        assertGe(bankBalance, 10 ether);
    }

    function testWithdrawWorks() public {
        uint256 beforeBalance = user1.balance;
        vm.prank(user1);
        bank.withdraw(5 ether);
        uint256 afterBalance = user1.balance;

        assertGt(afterBalance, beforeBalance);
        assertEq(bank.balances(user1), 5 ether);
    }

    function testDrain() public {
        vm.deal(attacker, 1 ether);
        vm.prank(attacker);
        try attack.attack{value: 1 ether}() {} catch {}
        
        uint256 attackerAfter = attacker.balance;
        assertEq(attackerAfter, 1 ether);

        assertEq(address(bank).balance, 10 ether);
    }
}

 
