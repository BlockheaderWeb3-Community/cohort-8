// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/test.sol";
import "../src/Attack.sol";
import "../src/Fixer.sol";

contract VaultTest is Test {
    BalanceVault vault;
    Attacker attacker;
    FixedVault fixedVault;

   
    address victim = address(1);
    receive() external payable {}
    function setUp() public {
        vault = new BalanceVault();
        attacker = new Attacker(address(vault));
        fixedVault = new FixedVault();
    }
    
   
    function testReentrancyAttack() public {
        vm.deal(victim, 5 ether);
        vm.prank(victim);
        vault.deposit{value: 5 ether}();

        vm.deal(address(attacker), 1 ether);
        vm.prank(address(attacker));
        attacker.attack{value: 1 ether}();

        assertEq(address(vault).balance, 0);

        assertGt(address(attacker).balance, 1 ether);
    }

    function testAttackFailsAfterFix() public {
        Attacker attacker2 = new Attacker(address(fixedVault));
        vm.deal(victim, 5 ether);
        vm.prank(victim);
        fixedVault.deposit{value: 5 ether}();

        vm.deal(address(attacker2), 1 ether);
        vm.prank(address(attacker2));
        vm.expectRevert(); // can specify message if desired
        attacker2.attack{value: 1 ether}();

        assertEq(address(fixedVault).balance, 5 ether);
    }

    function testLegitWithdrawStillWorks() public {
    address user = address(2);

    vm.deal(user, 2 ether);

    vm.startPrank(user);
    fixedVault.deposit{value: 2 ether}();
    fixedVault.withdraw(1 ether);
    vm.stopPrank();

    assertEq(address(fixedVault).balance, 1 ether);
}
}
