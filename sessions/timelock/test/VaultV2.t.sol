// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {TimeLockV2} from "../src/VaultV2.sol";
import {JasonToken} from "../src/Token.sol";

contract VaultV2Test is Test {
    TimeLockV2 public vault;
    JasonToken public token;
    address public owner;
    address public user;
    address public attacker;
    address public newOwner;

    uint256 oneDay = 86400;

    function setUp() public {
        owner = makeAddr("owner");
        vm.startPrank(owner);
        token = new JasonToken(address(this), address(this));
        vault = new TimeLockV2(address(token));
        vm.stopPrank();
        user = makeAddr("user");
        attacker = makeAddr("attacker");
        newOwner = makeAddr("newOwner");

        token.transfer(address(vault), 500 * 10 ** token.decimals());

        vm.deal(user, 10 ether);
        vm.deal(attacker, 10 ether);
    }

    function test_ownerIsSetOnDeployment() public view {
        assertEq(vault.owner(), owner);
        console.log("Owner: ", vault.owner());
        console.log("This: ", owner);
    }

    function test_emergencyWithdraw() public {
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 ownerBalanceBefore = owner.balance;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(owner);
        uint256 withdrawnAmount = vault.emergencyWithdraw();

        assertEq(withdrawnAmount, 1 ether);
        assertEq(address(vault).balance, 0);
        assertEq(owner.balance, ownerBalanceBefore + 1 ether);
    }

    function test_revert_emergencyWithdraw_notOwner() public {
        uint256 unlockTime = block.timestamp + oneDay;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(attacker);
        vm.expectRevert();
        vault.emergencyWithdraw();
    }

    function test_transferOwnership_and_acceptOwnership() public {
        vm.prank(owner);
        vault.transferOwnership(newOwner);

        assertEq(vault.pendingOwner(), newOwner);

        vm.prank(newOwner);
        vault.acceptOwnership();

        assertEq(vault.owner(), newOwner);
        assertEq(vault.pendingOwner(), address(0));
    }

    function test_revert_transferOwnership_notOwner() public {
        vm.prank(attacker);
        vm.expectRevert("Not owner");
        vault.transferOwnership(newOwner);
    }

    function test_revert_acceptOwnership_notPendingOwner() public {
        vm.prank(owner);
        vault.transferOwnership(newOwner);

        vm.prank(attacker);
        vm.expectRevert("Not pending owner");
        vault.acceptOwnership();
    }

    function test_emergencyWithdraw_accessAfterOwnershipTransfer() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(owner);
        vault.transferOwnership(newOwner);

        vm.prank(newOwner);
        vault.acceptOwnership();

        vm.prank(owner);
        vm.expectRevert("Not owner");
        vault.emergencyWithdraw();

        uint256 newOwnerBalanceBefore = newOwner.balance;
        vm.prank(newOwner);
        uint256 withdrawnAmount = vault.emergencyWithdraw();

        assertEq(withdrawnAmount, 1 ether);
        assertEq(address(vault).balance, 0);
        assertEq(newOwner.balance, newOwnerBalanceBefore + 1 ether);
    }

    function test_deposit() public {
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 userEthBefore = user.balance;
        uint256 vaultEthBefore = address(vault).balance;
        uint256 userTokenBefore = token.balanceOf(user);
        uint256 vaultTokenBefore = token.balanceOf(address(vault));

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        assertEq(user.balance, userEthBefore - 1 ether);
        assertEq(address(vault).balance, vaultEthBefore + 1 ether);
        assertEq(token.balanceOf(user), userTokenBefore + 10 ether);
        assertEq(token.balanceOf(address(vault)), vaultTokenBefore - 10 ether);
        assertEq(vault.getVaultCount(user), 1);

        (uint256 balance, uint256 tokenBalance, uint256 savedUnlockTime, bool active, bool isUnlocked) =
            vault.getVault(user, 0);

        assertEq(balance, 1 ether);
        assertEq(tokenBalance, 10 ether);
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

    function test_getActiveVaults() public {
        uint256 firstUnlockTime = block.timestamp + 1 days;
        uint256 secondUnlockTime = block.timestamp + 2 days;

        vm.startPrank(user);
        vault.deposit{value: 1 ether}(firstUnlockTime);
        vault.deposit{value: 2 ether}(secondUnlockTime);
        token.approve(address(vault), 10 ether);
        vm.stopPrank();

        vm.warp(firstUnlockTime);

        vm.prank(user);
        vault.withdraw(0);

        (
            uint256[] memory activeVaults,
            uint256[] memory balances,
            uint256[] memory tokenBalances,
            uint256[] memory unlockTimes
        ) = vault.getActiveVaults(user);

        assertEq(activeVaults.length, 1);
        assertEq(balances.length, 1);
        assertEq(tokenBalances.length, 1);
        assertEq(unlockTimes.length, 1);
        assertEq(activeVaults[0], 1);
        assertEq(balances[0], 2 ether);
        assertEq(tokenBalances[0], 20 ether);
        assertEq(unlockTimes[0], secondUnlockTime);
    }

    function test_withdraw() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(user);
        token.approve(address(vault), 10 ether);

        vm.warp(unlockTime);

        uint256 userEthBefore = user.balance;
        uint256 vaultEthBefore = address(vault).balance;
        uint256 userTokenBefore = token.balanceOf(user);
        uint256 vaultTokenBefore = token.balanceOf(address(vault));

        vm.prank(user);
        vault.withdraw(0);

        assertEq(user.balance, userEthBefore + 1 ether);
        assertEq(address(vault).balance, vaultEthBefore - 1 ether);
        assertEq(token.balanceOf(user), userTokenBefore - 10 ether);
        assertEq(token.balanceOf(address(vault)), vaultTokenBefore + 10 ether);

        (uint256 balance, uint256 tokenBalance,, bool active, bool isUnlocked) = vault.getVault(user, 0);
        assertEq(balance, 0);
        assertEq(tokenBalance, 0);
        assertFalse(active);
        assertTrue(isUnlocked);
    }

    function test_revert_withdraw_withoutApproval() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.warp(unlockTime);

        vm.prank(user);
        vm.expectRevert();
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

        uint256 userEthBefore = user.balance;
        uint256 vaultEthBefore = address(vault).balance;

        vm.prank(user);
        uint256 amount = vault.withdrawAll();

        assertEq(amount, 3 ether);
        assertEq(user.balance, userEthBefore + 3 ether);
        assertEq(address(vault).balance, vaultEthBefore - 3 ether);
        assertEq(vault.getTotalBalance(user), 0);
    }

    function test_revert_withdraw_fromAnotherUsersVault() public {
        uint256 unlockTime = block.timestamp + 1 days;

        vm.prank(user);
        vault.deposit{value: 1 ether}(unlockTime);

        vm.prank(attacker);
        vm.expectRevert("Invalid vault ID");
        vault.withdraw(0);
    }
}
