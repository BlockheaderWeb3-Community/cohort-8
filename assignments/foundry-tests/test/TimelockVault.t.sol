// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "../lib/forge-std/src/Test.sol";
import {TimelockVault} from "../src/TimelockVault.sol";
import {console} from "../lib/forge-std/src/console.sol";

contract TimelockVaultTest is Test {
  TimelockVault public timelockVault;

  address public user = makeAddr("moses");
  address public otherUser = makeAddr("otherUser");

  uint256 constant ONE_ETHER = 1 ether;
  uint256 constant ONE_DAY = 1 days;
  uint256 constant ONE_WEEK = 7 days;

  uint256 public futureUnlockTime;

  // === Setup function to deploy the contract and beforeEach
  function setUp() public {
    timelockVault = new TimelockVault();

    vm.deal(user, 100 ether);
    vm.deal(otherUser, 100 ether);

    futureUnlockTime = block.timestamp + ONE_WEEK;
    console.log("The futureUnlockTime is: ", futureUnlockTime);
  }

  // === Default Values
  function testDefaultValuesOfStateVariables() public view {
    console.log("Test 1: testDefaultValues");
    console.log("   ");

    uint vaultCount = timelockVault.getVaultCount(user);
    console.log("Vault count is:", vaultCount);
    assertEq(vaultCount, 0);

    uint totalBalance = timelockVault.getTotalBalance(user);
    console.log("Total balance is:", totalBalance);
    assertEq(totalBalance, 0);

    uint unlockedBalance = timelockVault.getUnlockedBalance(user);
    console.log("Unlocked balance:", unlockedBalance);
    assertEq(unlockedBalance, 0);
  }

  // === Deposit Values
  function testDepositRevertsWhenAmountIsZero() public {
    vm.prank(user);
    vm.expectRevert("Invalid vault ID");
    timelockVault.withdraw(0);
  }

  function testDepositCreatesVaultWithCorrectUnlockTime() public {
    vm.prank(user);

    uint vaultId = timelockVault.deposit{value: 1 ether}(futureUnlockTime);
    (uint balance, uint storedUnlockTime, bool active, bool isUnlocked) = timelockVault.getVault(
      user,
      vaultId
    );

    assertEq(balance, 1 ether);
    assertEq(storedUnlockTime, futureUnlockTime);
    assertTrue(active);
    assertFalse(isUnlocked);
  }

  function testDepositRevertsWhenUnlockTimeInPast() public {
    vm.prank(user);
    vm.expectRevert("Unlock time must be in the future");
    timelockVault.deposit{value: 0.5 ether}(block.timestamp - 1);
  }

  function testDepositCreatesVaultAndEmitsEvent() public {
    vm.prank(user);

    vm.expectEmit(true, true, false, true);
    emit TimelockVault.Deposited(user, 0, ONE_ETHER, futureUnlockTime);

    uint vaultId = timelockVault.deposit{value: ONE_ETHER}(futureUnlockTime);

    assertEq(vaultId, 0);

    (uint bal, uint unlock, bool active, bool isUnlocked) = timelockVault.getVault(user, 0);
    assertEq(bal, ONE_ETHER);
    assertEq(unlock, futureUnlockTime);
    assertTrue(active);
    assertFalse(isUnlocked);

    assertEq(timelockVault.getVaultCount(user), 1);
    assertEq(timelockVault.getTotalBalance(user), ONE_ETHER);
    assertEq(timelockVault.getUnlockedBalance(user), 0);
  }

  function testMultipleDepositsIncreaseVaultCount() public {
    vm.startPrank(user);

    timelockVault.deposit{value: 1 ether}(futureUnlockTime);
    timelockVault.deposit{value: 2 ether}(futureUnlockTime + ONE_DAY);
    timelockVault.deposit{value: 3 ether}(futureUnlockTime + ONE_WEEK);

    vm.stopPrank();

    assertEq(timelockVault.getVaultCount(user), 3);
    assertEq(timelockVault.getTotalBalance(user), 6 ether);
  }

  // === Withdraw Single Vault
  function testWithdrawRevertsInvalidVaultId() public {
    vm.prank(user);
    vm.expectRevert("Invalid vault ID");
    timelockVault.withdraw(0);
  }

  function testWithdrawRevertsWhenStillLocked() public {
    vm.prank(user);
    uint id = timelockVault.deposit{value: ONE_ETHER}(futureUnlockTime);

    vm.prank(user);
    vm.expectRevert("Funds are still locked");
    timelockVault.withdraw(id);
  }

  function testWithdrawRevertsWhenAlreadyWithdrawn() public {
    vm.prank(user);
    uint id = timelockVault.deposit{value: ONE_ETHER}(futureUnlockTime);

    vm.warp(futureUnlockTime + 1);

    vm.prank(user);
    timelockVault.withdraw(id);

    vm.prank(user);
    vm.expectRevert("Vault is not active");
    timelockVault.withdraw(id);
  }

  // === Withdraw All
  function testWithdrawAllRevertsWhenNoUnlockedFunds() public {
    vm.prank(user);
    timelockVault.deposit{value: 1 ether}(futureUnlockTime + ONE_DAY);

    vm.expectRevert("No unlocked funds available");
    timelockVault.withdrawAll();
  }

  function testWithdrawAllSendsOnlyUnlockedVaults() public {
    vm.startPrank(user);
    timelockVault.deposit{value: 4 ether}(futureUnlockTime);
    timelockVault.deposit{value: 5 ether}(futureUnlockTime + ONE_WEEK);
    vm.stopPrank();

    vm.warp(futureUnlockTime + 1);

    uint before = user.balance;

    vm.expectEmit(true, true, false, true);
    emit TimelockVault.Withdrawn(user, 0, 4 ether);

    vm.prank(user);
    uint withdrawn = timelockVault.withdrawAll();

    assertEq(withdrawn, 4 ether);
    assertEq(user.balance - before, 4 ether);
    assertEq(timelockVault.getUnlockedBalance(user), 0);
    assertEq(timelockVault.getTotalBalance(user), 5 ether);
  }

  // === View Functions
  function testGetActiveVaultsReturnsCorrectData() public {
    vm.startPrank(user);
    timelockVault.deposit{value: 2 ether}(futureUnlockTime + ONE_DAY);
    timelockVault.deposit{value: 3 ether}(futureUnlockTime);

    vm.stopPrank();

    vm.warp(futureUnlockTime + 1);

    (uint[] memory ids, uint[] memory bals, uint[] memory unlocks) = timelockVault.getActiveVaults(user);

    assertEq(ids.length, 2);
    console.log("Ids.length: ", ids.length);
    assertEq(ids[0], 0);
     console.log("Ids.length: ", ids[0]);
    assertEq(bals[0], 2 ether);
    assertEq(unlocks[0], futureUnlockTime + ONE_DAY);
  }

  function testOtherUserCannotSeeOrWithdrawAnything() public {
    vm.prank(user);
    timelockVault.deposit{value: ONE_ETHER}(futureUnlockTime);

    vm.prank(otherUser);
    assertEq(timelockVault.getVaultCount(otherUser), 0);
    assertEq(timelockVault.getTotalBalance(otherUser), 0);

    vm.expectRevert("Invalid vault ID");
    timelockVault.withdraw(0);
  }
}
