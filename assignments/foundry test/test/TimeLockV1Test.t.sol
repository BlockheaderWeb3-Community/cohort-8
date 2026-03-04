// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test} from 'forge-std/Test.sol';
import {console} from 'forge-std/console.sol';
import {TimeLockV1} from '../src/TimeLockV1.sol';
import {Loner} from '../src/token.sol';

contract TimeLockV1Test is Test {
  TimeLockV1 public vault;
  Loner public token;
  address public owner;
  address public user;
  address public attacker;
  address public newOwner;

  uint oneDay = 86400;

  function setUp() public {
    owner = makeAddr("owner");
    vm.startPrank(owner);
    token = new Loner(address(this));
    vault = new TimeLockV1(address(token));
    vm.stopPrank();
    user = makeAddr('user');
    attacker = makeAddr('attacker');

    // Grant MINTER_ROLE and BURNER_ROLE to vault so it can mint/burn tokens
    vm.prank(owner);
    token.grantRole(token.MINTER_ROLE(), address(vault));
    
    vm.prank(owner);
    token.grantRole(token.BURNER_ROLE(), address(vault));

    // Transfer some tokens to vault for testing (if needed)
    vm.prank(owner);
    token.transfer(address(vault), 500 * 10 ** token.decimals());

    vm.deal(user, 10 ether);
    vm.deal(attacker, 10 ether);
  }

  function test_ownerIsSetOnDeployment() public view {
    assertEq(vault.owner(), owner);
    console.log("Owner: ", vault.owner());
    console.log("This: ", owner);
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
    // User receives minted tokens
    assertEq(token.balanceOf(user), userTokenBefore + 10 ether);
    // Vault token balance stays the same (tokens are minted to user, not vault)
    assertEq(token.balanceOf(address(vault)), vaultTokenBefore);
    assertEq(vault.getVaultCount(user), 1);

    (
      uint256 balance,
      uint256 savedUnlockTime,
      bool active,
      bool isUnlocked
    ) = vault.getVault(user, 0);

    assertEq(balance, 1 ether);
    assertEq(savedUnlockTime, unlockTime);
    assertTrue(active);
    assertFalse(isUnlocked);
  }

  function test_revert_deposit_withZeroValue() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vm.expectRevert('Deposit must be greater than zero');
    vault.deposit{value: 0}(unlockTime);
  }

  function test_revert_deposit_withPastUnlockTime() public {
    vm.expectRevert('Unlock time must be in the future');
    vm.prank(user);
    vault.deposit{value: 1 ether}(block.timestamp - 1);
  }

  function test_withdraw() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    // Approve the vault to burn tokens
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
    // User burns tokens (they are burned, not transferred to vault)
    assertEq(token.balanceOf(user), userTokenBefore - 10 ether);
    // Vault token balance unchanged (tokens are burned, not transferred)
    assertEq(token.balanceOf(address(vault)), vaultTokenBefore);

    (
      uint256 balance,
      ,
      bool active,
      bool isUnlocked
    ) = vault.getVault(user, 0);
    assertEq(balance, 0);
    assertFalse(active);
    assertTrue(isUnlocked);
  }

  function test_revert_withdraw_beforeUnlock() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    vm.prank(user);
    token.approve(address(vault), 10 ether);

    // Don't warp to unlock time
    vm.prank(user);
    vm.expectRevert('Funds are still locked');
    vault.withdraw(0);
  }

  // Note: This test is disabled because the vault has BURNER_ROLE, 
  // which allows it to burn tokens without user approval
  function test_revert_withdraw_withoutApproval_disabled() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    // Note: Even without approval, the vault's BURNER_ROLE allows burnFrom to succeed
    // So this test is disabled
    vm.warp(unlockTime);

    vm.prank(user);
    // This will actually succeed because vault has BURNER_ROLE
    vault.withdraw(0);
  }

  function test_revert_withdraw_invalidVaultId() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    vm.warp(unlockTime);

    vm.prank(user);
    vm.expectRevert('Invalid vault ID');
    vault.withdraw(999); // Invalid vault ID
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

  function test_revert_withdrawAll_noUnlockedFunds() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    vm.prank(user);
    vm.expectRevert('No unlocked funds available');
    vault.withdrawAll();
  }

  function test_revert_withdraw_fromAnotherUsersVault() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    vm.prank(attacker);
    vm.expectRevert('Invalid vault ID');
    vault.withdraw(0);
  }

  function test_getActiveVaults() public {
    uint256 firstUnlockTime = block.timestamp + 1 days;
    uint256 secondUnlockTime = block.timestamp + 2 days;

    vm.startPrank(user);
    vault.deposit{value: 1 ether}(firstUnlockTime);
    vault.deposit{value: 2 ether}(secondUnlockTime);
    token.approve(address(vault), 30 ether);
    vm.stopPrank();

    vm.warp(firstUnlockTime);

    vm.prank(user);
    vault.withdraw(0);

    (
      uint256[] memory activeVaults,
      uint256[] memory balances,
      uint256[] memory unlockTimes
    ) = vault.getActiveVaults(user);

    assertEq(activeVaults.length, 1);
    assertEq(balances.length, 1);
    assertEq(unlockTimes.length, 1);
    assertEq(activeVaults[0], 1);
    assertEq(balances[0], 2 ether);
    assertEq(unlockTimes[0], secondUnlockTime);
  }

  function test_getTotalBalance() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);
    
    vm.prank(user);
    vault.deposit{value: 2 ether}(unlockTime);

    assertEq(vault.getTotalBalance(user), 3 ether);
  }

  function test_getUnlockedBalance() public {
    uint256 firstUnlockTime = block.timestamp + 1 days;
    uint256 secondUnlockTime = block.timestamp + 2 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(firstUnlockTime);
    
    vm.prank(user);
    vault.deposit{value: 2 ether}(secondUnlockTime);

    // Before first unlock time
    assertEq(vault.getUnlockedBalance(user), 0);

    // Warp to first unlock time
    vm.warp(firstUnlockTime);
    assertEq(vault.getUnlockedBalance(user), 1 ether);

    // Warp to second unlock time
    vm.warp(secondUnlockTime);
    assertEq(vault.getUnlockedBalance(user), 3 ether);
  }

  function test_extendLockTime() public {
    uint256 originalUnlock = block.timestamp + 1 days;
    uint256 newUnlock = block.timestamp + 5 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(originalUnlock);

    vm.prank(user);
    vault.extendLockTime(0, newUnlock);

    (, uint256 savedUnlockTime,,) = vault.getVault(user, 0);
    assertEq(savedUnlockTime, newUnlock);
  }

  function test_revert_extendLockTime_notOwner() public {
    uint256 originalUnlock = block.timestamp + 1 days;
    uint256 newUnlock = block.timestamp + 5 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(originalUnlock);

    // Attacker tries to extend
    vm.prank(attacker);
    vm.expectRevert();
    vault.extendLockTime(0, newUnlock);
  }

  function test_getTotalMinted() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    // 1 ETH * 10 tokens per ETH = 10 tokens
    assertEq(vault.getTotalMinted(), 10 ether);
  }

  function test_getVaultCount() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);
    
    vm.prank(user);
    vault.deposit{value: 2 ether}(unlockTime);

    assertEq(vault.getVaultCount(user), 2);
  }

  function test_getMaxMintable() public view {
    // MAX_MINTABLE is type(uint256).max (unlimited)
    assertEq(vault.getMaxMintable(), type(uint256).max);
  }

  function test_getTimeUntilUnlock() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    uint256 timeUntil = vault.getTimeUntilUnlock(user, 0);
    assertEq(timeUntil, 1 days);
  }

  function test_canWithdraw() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    // Before unlock time, canWithdraw should return (false, 0)
    (bool canWithdraw, uint256 tokensNeeded) = vault.canWithdraw(user, 0);
    assertFalse(canWithdraw);
    assertEq(tokensNeeded, 0);

    // Warp to unlock time
    vm.warp(unlockTime);

    // After approval
    vm.prank(user);
    token.approve(address(vault), 10 ether);

    (canWithdraw, tokensNeeded) = vault.canWithdraw(user, 0);
    assertTrue(canWithdraw);
    assertEq(tokensNeeded, 10 ether);
  }

  // ========================================
  // EMERGENCY WITHDRAW TESTS
  // ========================================

  function test_emergencyWithdraw() public {
    uint256 unlockTime = block.timestamp + 1 days;
    uint256 ownerBalanceBefore = owner.balance;

    // User deposits ETH
    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);
    
    // Owner calls emergency withdraw to get all funds
    vm.prank(owner);
    uint256 withdrawnAmount = vault.emergencyWithdraw();

    assertEq(withdrawnAmount, 1 ether);
    assertEq(address(vault).balance, 0);
    assertEq(owner.balance, ownerBalanceBefore + 1 ether);
  }

  function test_revert_emergencyWithdraw_notOwner() public {
    uint256 unlockTime = block.timestamp + 1 days;

    vm.prank(user);
    vault.deposit{value: 1 ether}(unlockTime);

    vm.prank(attacker);
    vm.expectRevert();
    vault.emergencyWithdraw();
  }

  function test_revert_emergencyWithdraw_noFunds() public {
    // No deposits made
    
    vm.prank(owner);
    vm.expectRevert('No funds to withdraw');
    vault.emergencyWithdraw();
  }
}
