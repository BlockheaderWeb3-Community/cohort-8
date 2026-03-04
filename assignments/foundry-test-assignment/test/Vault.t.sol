// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TimeLock} from "../src/Vault.sol";

contract VaultTest is Test {
    TimeLock public vault;
    address public user;
    address public attacker;

    function setUp() public {
        vault = new TimeLock();
        user = makeAddr("user");
        attacker = makeAddr("attacker");

        assertEq(address(vault).balance, 0);

        vm.deal(user, 10 ether);
        vm.deal(attacker, 10 ether);
    }

    function test_deposit() public {
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 userBalanceBefore = user.balance;
        uint256 vaultBalanceBefore = address(vault).balance;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        assertEq(user.balance, userBalanceBefore - 1 ether);
        assertEq(address(vault).balance, vaultBalanceBefore + 1 ether);
        assertEq(vault.getVaultCount(user), 1);

        (uint256 balance, uint256 savedUnlockTime, bool active, bool isUnlocked) = vault.getVault(user, 0);
        assertEq(balance, 1 ether);
        assertEq(savedUnlockTime, unlockTime);
        assertTrue(active);
        assertFalse(isUnlocked);
    }

    function test_revert_deposit_withZeroValue() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vm.expectRevert("Deposit must be greater than zero");
        vault.deposit{value: 0}(unlockTime);
    }

    function test_revert_deposit_withNonFutureUnlockTime() public {
        vm.prank(user);
        vm.expectRevert("Unlock time must be in the future");
        vault.deposit{value: 1 ether}(block.timestamp);
    }

    function test_revert_getVault_withInvalidVaultId() public {
        vm.expectRevert("Invalid vault ID");
        vault.getVault(user, 0);
    }

    function test_getAllVaults() public {
        uint256 firstUnlockTime = block.timestamp + 1 days;
        uint256 secondUnlockTime = block.timestamp + 2 days;

        vm.startPrank(user);
        vault.deposit{value: 1 ether}(firstUnlockTime);
        vault.deposit{value: 2 ether}(secondUnlockTime);
        vm.stopPrank();

        TimeLock.Vault[] memory vaults = vault.getAllVaults(user);

        assertEq(vaults.length, 2);
        assertEq(vaults[0].balance, 1 ether);
        assertEq(vaults[0].unlockTime, firstUnlockTime);
        assertTrue(vaults[0].active);
        assertEq(vaults[1].balance, 2 ether);
        assertEq(vaults[1].unlockTime, secondUnlockTime);
        assertTrue(vaults[1].active);
    }

    function test_getActiveVaults() public {
        uint256 firstUnlockTime = block.timestamp + 1 days;
        uint256 secondUnlockTime = block.timestamp + 2 days;

        vm.startPrank(user);
        vault.deposit{value: 1 ether}(firstUnlockTime);
        vault.deposit{value: 2 ether}(secondUnlockTime);
        vm.stopPrank();

        vm.warp(firstUnlockTime);

        vm.prank(user);
        vault.withdraw(0);

        (uint256[] memory activeVaults, uint256[] memory balances, uint256[] memory unlockTimes) =
            vault.getActiveVaults(user);

        assertEq(activeVaults.length, 1);
        assertEq(balances.length, 1);
        assertEq(unlockTimes.length, 1);
        assertEq(activeVaults[0], 1);
        assertEq(balances[0], 2 ether);
        assertEq(unlockTimes[0], secondUnlockTime);
    }

    function test_getTotalBalance() public {
        uint256 firstUnlockTime = block.timestamp + 1 days;
        uint256 secondUnlockTime = block.timestamp + 2 days;

        vm.startPrank(user);
        vault.deposit{value: 1 ether}(firstUnlockTime);
        vault.deposit{value: 2 ether}(secondUnlockTime);
        vm.stopPrank();

        assertEq(vault.getTotalBalance(user), 3 ether);

        vm.warp(firstUnlockTime);

        vm.prank(user);
        vault.withdraw(0);

        assertEq(vault.getTotalBalance(user), 2 ether);
    }

    function test_getUnlockedBalance() public {
        uint256 firstUnlockTime = block.timestamp + 1 days;
        uint256 secondUnlockTime = block.timestamp + 2 days;

        vm.startPrank(user);
        vault.deposit{value: 1 ether}(firstUnlockTime);
        vault.deposit{value: 2 ether}(secondUnlockTime);
        vm.stopPrank();

        assertEq(vault.getUnlockedBalance(user), 0);

        vm.warp(firstUnlockTime);
        assertEq(vault.getUnlockedBalance(user), 1 ether);

        vm.warp(secondUnlockTime);
        assertEq(vault.getUnlockedBalance(user), 3 ether);
    }

    function test_withdraw() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.warp(unlockTime);

        uint256 userBalanceBefore = user.balance;
        uint256 vaultBalanceBefore = address(vault).balance;

        vm.prank(user);
        vault.withdraw(0);

        assertEq(user.balance, userBalanceBefore + 1 ether);
        assertEq(address(vault).balance, vaultBalanceBefore - 1 ether);

        (uint256 balance,, bool active, bool isUnlocked) = vault.getVault(user, 0);
        assertEq(balance, 0);
        assertFalse(active);
        assertTrue(isUnlocked);
    }

    function test_revert_withdraw_whenStillLocked() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(user);
        vm.expectRevert("Funds are still locked");
        vault.withdraw(0);
    }

    function test_revert_withdraw_fromAnotherUsersVault() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(attacker);
        vm.expectRevert("Invalid vault ID");
        vault.withdraw(0);
    }

    function test_withdrawAll() public {
        uint256 firstUnlockTime = block.timestamp + 1 days;
        uint256 secondUnlockTime = block.timestamp + 2 days;

        vm.startPrank(user);
        vault.deposit{value: 1 ether}(firstUnlockTime);
        vault.deposit{value: 2 ether}(secondUnlockTime);
        vm.stopPrank();

        vm.warp(secondUnlockTime);

        uint256 userBalanceBefore = user.balance;
        uint256 vaultBalanceBefore = address(vault).balance;

        vm.prank(user);
        uint256 amount = vault.withdrawAll();

        assertEq(amount, 3 ether);
        assertEq(user.balance, userBalanceBefore + 3 ether);
        assertEq(address(vault).balance, vaultBalanceBefore - 3 ether);
        assertEq(vault.getTotalBalance(user), 0);
    }

    function test_revert_withdrawAll_fromUserWithoutUnlockedFunds() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(attacker);
        vm.expectRevert("No unlocked funds available");
        vault.withdrawAll();
    }
}
