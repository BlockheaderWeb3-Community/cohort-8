//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {Test} from "forge-std/Test.sol";
import {TimeLock} from "../src/TimeLock.sol";
import {console} from "forge-std/console.sol";

contract TimeLockTest is Test {
    TimeLock public timelock;
    address public addr1;

    function setUp() public {
        timelock = new TimeLock();
        addr1 = makeAddr("addr1");
        vm.deal(addr1, 10 ether);
    }

    function test_getVault() public view {
        //get the user vault count at onset vault count should be 0
        uint256 count = timelock.getVaultCount(addr1);
        console.log(count);
        assertEq(count, 0);
    }

    //Transactions
    function test_zero_deposit_should_fail() public {
        vm.prank(addr1);
        uint256 vaultCount = timelock.getVaultCount(addr1);

        vm.expectRevert("Deposit must be greater than zero");
        timelock.deposit(block.timestamp + 10);
        //assertions
        uint256 count = timelock.getVaultCount(addr1);
        assertEq(count, vaultCount);
    }

    function test_unlocktime_fail() public {
        vm.prank(addr1);

        uint256 vaultCount = timelock.getVaultCount(addr1);

        vm.expectRevert("Unlock time must be in the future");
        timelock.deposit{value: addr1.balance - 5 ether}(block.timestamp);

        uint256 vaultCountAfter = timelock.getVaultCount(addr1);
        assertEq(vaultCountAfter, vaultCount);
    }

    function test_successful_deposit() public {
        vm.startPrank(addr1);
        console.log("addr1 balance is ____", addr1.balance);

        timelock.getVaultCount(addr1);
        uint256 id = timelock.deposit{value: 5 ether}(block.timestamp + 3600);
        uint256 id2 = timelock.deposit{value: 5 ether}(block.timestamp + 3600);

        (uint256 balance, uint256 unlockTime, bool active, bool isUnlocked) = timelock.getVault(addr1, id);
        console.log("the id is __", id);

        console.log("the id is __", id2);
        timelock.getVault(addr1, id2);
        uint256 c = timelock.getVaultCount(addr1);
        console.log(c);
        console.log("addr1 balance is ____", addr1.balance);
        console.log("isUnlocked____", isUnlocked);
        
        //ASSERTIONS
        assertGt(balance, addr1.balance);
        assertEq(active, true);
        assertEq(isUnlocked, false);
        assertGt(unlockTime, block.timestamp);
        assertGt(id2, id);
        vm.stopPrank();
    }
  
    function test_should_revert_withdraw() public {
      vm.prank(addr1);
      vm.expectRevert("Invalid vault ID");
      timelock.withdraw(2);
    }
   function test_should_revert_due_inactive_vault() public{
     vm.prank(addr1);
     uint id = timelock.deposit{value: 1 ether}(block.timestamp + 2);
     address alice;
     vm.expectRevert();
     (,,bool active,) = timelock.getVault(alice, id);
     assertFalse(active);
   }

    function test_successful_withdraw() public {
        vm.startPrank(addr1);
        uint256 id = timelock.deposit{value: 3 ether}(block.timestamp + 10);
        
        vm.warp(block.timestamp + 11);
        uint256 balanceBefore = addr1.balance;
        timelock.withdraw(id);
        
        assertEq(addr1.balance, balanceBefore + 3 ether);
        (,, bool active,) = timelock.getVault(addr1, id);
        assertFalse(active);
        vm.stopPrank();
    }

    function test_withdraw_before_unlock_should_fail() public {
        vm.startPrank(addr1);
        uint256 id = timelock.deposit{value: 2 ether}(block.timestamp + 100);
        
        vm.expectRevert("Funds are still locked");
        timelock.withdraw(id);
        vm.stopPrank();
    }

    function test_withdrawAll_success() public {
        vm.startPrank(addr1);
        timelock.deposit{value: 2 ether}(block.timestamp + 10);
        timelock.deposit{value: 3 ether}(block.timestamp + 10);
        
        vm.warp(block.timestamp + 11);
        uint256 balanceBefore = addr1.balance;
        uint256 withdrawn = timelock.withdrawAll();
        
        assertEq(withdrawn, 5 ether);
        assertEq(addr1.balance, balanceBefore + 5 ether);
        vm.stopPrank();
    }

    function test_withdrawAll_no_unlocked_funds() public {
        vm.startPrank(addr1);
        timelock.deposit{value: 1 ether}(block.timestamp + 100);
        
        vm.expectRevert("No unlocked funds available");
        timelock.withdrawAll();
        vm.stopPrank();
    }

    function test_getTotalBalance() public {
        vm.startPrank(addr1);
        timelock.deposit{value: 2 ether}(block.timestamp + 10);
        timelock.deposit{value: 3 ether}(block.timestamp + 20);
        
        uint256 total = timelock.getTotalBalance(addr1);
        assertEq(total, 5 ether);
        vm.stopPrank();
    }

    function test_getUnlockedBalance() public {
        vm.startPrank(addr1);
        timelock.deposit{value: 2 ether}(block.timestamp + 10);
        timelock.deposit{value: 3 ether}(block.timestamp + 100);
        
        vm.warp(block.timestamp + 11);
        uint256 unlocked = timelock.getUnlockedBalance(addr1);
        assertEq(unlocked, 2 ether);
        vm.stopPrank();
    }

    function test_getActiveVaults() public {
        vm.startPrank(addr1);
        timelock.deposit{value: 1 ether}(block.timestamp + 10);
        timelock.deposit{value: 2 ether}(block.timestamp + 20);
        
        (uint256[] memory ids, uint256[] memory balances,) = timelock.getActiveVaults(addr1);
        assertEq(ids.length, 2);
        assertEq(balances[0], 1 ether);
        assertEq(balances[1], 2 ether);
        vm.stopPrank();
    }
}
