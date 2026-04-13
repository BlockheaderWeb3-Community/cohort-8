// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import 'forge-std/Test.sol';
import '../src/Timelockv2.sol';
import '../src/Mira.sol';

contract TimelockVaultTest is Test {
  TimelockVault vault;
  Mira mira;

  address owner = address(10);
  address user = address(1);

  function setUp() public {
    mira = new Mira(owner);

    vault = new TimelockVault(address(mira));

    vm.prank(owner);
    mira.transferOwnership(address(vault));
    vm.deal(user, 10 ether);
  }

  function testConstructorRevertsIfZeroAddress() public {
    vm.expectRevert('Invalid token address');
    new TimelockVault(address(0));
  }

  function testDepositSuccess() public {
    vm.prank(user);

    uint unlockTime = block.timestamp + 1 days;

    uint vaultId = vault.deposit{value: 1 ether}(unlockTime);

    assertEq(vault.getVaultCount(user), 1);
    assertEq(vaultId, 0);

    // 1 ETH = 10 MIRA
    assertEq(mira.balanceOf(user), 10 ether);
  }

  function testDepositRevertsIfZeroValue() public {
    vm.prank(user);

    vm.expectRevert('Deposit must be greater than zero');
    vault.deposit{value: 0}(block.timestamp + 1 days);
  }

  function testDepositRevertsIfPastUnlockTime() public {
    vm.prank(user);

    vm.expectRevert('Unlock time must be in the future');
    vault.deposit{value: 1 ether}(block.timestamp - 1);
  }

  function testWithdrawSuccess() public {
    vm.startPrank(user);

    uint unlockTime = block.timestamp + 1 days;

    vault.deposit{value: 1 ether}(unlockTime);

    vm.warp(unlockTime);

    mira.approve(address(vault), 10 ether);

    vault.withdraw(0);

    assertEq(mira.balanceOf(user), 0);
    assertEq(user.balance, 10 ether);

    vm.stopPrank();
  }

  function testWithdrawRevertsIfLocked() public {
    vm.startPrank(user);

    uint unlockTime = block.timestamp + 1 days;

    vault.deposit{value: 1 ether}(unlockTime);

    vm.expectRevert('Funds are still locked');
    vault.withdraw(0);

    vm.stopPrank();
  }

  function testWithdrawRevertsIfInvalidVault() public {
    vm.prank(user);

    vm.expectRevert('Invalid vault ID');
    vault.withdraw(0);
  }

  function testWithdrawAllSuccess() public {
    vm.startPrank(user);

    uint unlockTime = block.timestamp + 1 days;

    vault.deposit{value: 1 ether}(unlockTime);
    vault.deposit{value: 2 ether}(unlockTime);

    vm.warp(unlockTime);

    mira.approve(address(vault), 30 ether);

    uint withdrawn = vault.withdrawAll();

    assertEq(withdrawn, 3 ether);
    assertEq(user.balance, 10 ether);
    // assertEq(mira.balanceOf(user), 0);

    vm.stopPrank();
  }

  function testWithdrawAllRevertsIfNothingUnlocked() public {
    vm.startPrank(user);

    vault.deposit{value: 1 ether}(block.timestamp + 1 days);

    vm.expectRevert('No unlocked funds available');
    vault.withdrawAll();

    vm.stopPrank();
  }

  function testGetVault() public {
    vm.prank(user);

    uint unlockTime = block.timestamp + 1 days;

    vault.deposit{value: 1 ether}(unlockTime);

    (uint balance, uint unlock, bool active, bool unlocked) = vault.getVault(
      user,
      0
    );

    assertEq(balance, 1 ether);
    assertEq(unlock, unlockTime);
    assertTrue(active);
    assertFalse(unlocked);
  }

  function testGetTotalBalance() public {
    vm.startPrank(user);

    vault.deposit{value: 1 ether}(block.timestamp + 1 days);
    vault.deposit{value: 2 ether}(block.timestamp + 1 days);

    uint total = vault.getTotalBalance(user);

    assertEq(total, 3 ether);

    vm.stopPrank();
  }

  function testGetUnlockedBalance() public {
    vm.startPrank(user);

    uint unlockTime = block.timestamp + 1 days;

    vault.deposit{value: 1 ether}(unlockTime);

    vm.warp(unlockTime);

    uint unlocked = vault.getUnlockedBalance(user);

    assertEq(unlocked, 1 ether);

    vm.stopPrank();
  }
}
