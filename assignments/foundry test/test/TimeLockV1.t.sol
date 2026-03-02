// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../src/TimeLock.sol";

/**
 * 🎮 FOUNDRY TESTING QUEST 🎮
 * 
 * Welcome, brave tester! Your mission is to write Solidity tests for the TimeLockV1 contract.
 * 
 * 📚 FOUNDRY BASICS:
 * - Test functions must start with "test"
 * - Use setUp() to initialize before each test
 * - Use vm.prank(address) to simulate calls from different addresses
 * - Use vm.warp(timestamp) to change block.timestamp
 * - Use vm.deal(address, amount) to give ETH to an address
 * - Use vm.expectRevert() to test for reverts
 * 
 * 🔧 USEFUL ASSERTIONS:
 * - assertEq(a, b) - assert a equals b
 * - assertTrue(condition) - assert condition is true
 * - assertFalse(condition) - assert condition is false
 * - assertGt(a, b) - assert a > b
 * - assertLt(a, b) - assert a < b
 * 
 * 🎯 YOUR QUESTS:
 * 
 * QUEST 1: Setup & Deployment ⚔️
 * - Deploy the TimeLockV1 contract in setUp()
 * - Create test addresses (user1, user2)
 * - Give them some ETH to work with
 * 
 * QUEST 2: Test Deposit Function 💰
 * - Test successful deposit
 * - Test deposit with 0 value (should revert)
 * - Test deposit with past unlock time (should revert)
 * - Verify vault is created correctly
 * - Check that Deposited event is emitted
 * 
 * QUEST 3: Test Withdraw Function 🏦
 * - Test successful withdrawal after unlock time
 * - Test withdrawal before unlock time (should revert)
 * - Test withdrawal of non-existent vault (should revert)
 * - Test that another user can't withdraw your vault
 * - Verify balances change correctly
 * 
 * QUEST 4: Test WithdrawAll Function 🌟
 * - Create multiple vaults with different unlock times
 * - Test withdrawing all unlocked vaults at once
 * - Verify only unlocked vaults are withdrawn
 * - Test with no unlocked vaults (should revert)
 * 
 * QUEST 5: Test View Functions 🔍
 * - Test getTotalBalance()
 * - Test getUnlockedBalance()
 * - Test getActiveVaults()
 * - Test getVault()
 * - Test getAllVaults()
 * 
 * 💡 TIPS:
 * - Start simple, then add complexity
 * - Test one thing at a time
 * - Use descriptive test names
 * - Run tests with: forge test
 * - Run specific test: forge test --match-test testDeposit
 * - See gas usage: forge test --gas-report
 * - Verbose output: forge test -vvvv
 * 
 * Good luck, adventurer! 🚀
 */

contract TimeLockV1Test is Test {
    TimeLockV1 public timelock;
    
    address public user1;
    address public user2;
    
    // Events to test
    event Deposited(address indexed user, uint vaultId, uint amount, uint unlockTime);
    event Withdrawn(address indexed user, uint vaultId, uint amount);
    
    function setUp() public {
        // 🎯 QUEST 1: Deploy and setup
        timelock = new TimeLockV1();
        
        // Create user addresses
        user1 = address(1);
        user2 = address(2);

        // Give users some ETH
        vm.deal(user1, 1000 ether);
        vm.deal(user2, 1000 ether);
    }
    
    // 🎯 QUEST 2: DEPOSIT TESTS
    
    function testDeposit() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 1 ether;
        
        // Check initial state BEFORE deposit
        uint256 userBalanceBefore = user1.balance;
        uint256 contractBalanceBefore = address(timelock).balance;
        uint256 vaultCountBefore = timelock.getVaultCount(user1);
        
        assertEq(userBalanceBefore, 1000 ether, "User should start with 1000 ether");
        assertEq(contractBalanceBefore, 0, "Contract should start with 0 balance");
        assertEq(vaultCountBefore, 0, "User should have 0 vaults initially");
        
        // Perform action: deposit
        vm.prank(user1);
        uint256 vaultId = timelock.deposit{value: depositAmount}(unlockTime);
        
        // Check state AFTER deposit
        uint256 userBalanceAfter = user1.balance;
        uint256 contractBalanceAfter = address(timelock).balance;
        uint256 vaultCountAfter = timelock.getVaultCount(user1);
        
        // Check vault was created correctly
        (uint256 balance, uint256 unlock, bool active, bool isUnlocked) = 
            timelock.getVault(user1, 0);
        
        // Assert all state changes
        assertEq(vaultId, 0, "First vault should have ID 0");
        assertEq(vaultCountAfter, 1, "User should have 1 vault after deposit");
        assertEq(userBalanceBefore - userBalanceAfter, depositAmount, "User balance should decrease by deposit amount");
        assertEq(contractBalanceAfter - contractBalanceBefore, depositAmount, "Contract balance should increase by deposit amount");
        assertEq(balance, depositAmount, "Vault balance should match deposit amount");
        assertEq(unlock, unlockTime, "Unlock time should match");
        assertTrue(active, "Vault should be active");
        assertFalse(isUnlocked, "Vault should not be unlocked yet");
    }
    
    function testDepositRevertsWithZeroValue() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        vm.prank(user1);
        vm.expectRevert("Deposit must be greater than zero");
        timelock.deposit{value: 0}(unlockTime);
    }
    
    function testDepositRevertsWithPastUnlockTime() public {
        // Use a timestamp that's definitely in the past (timestamp 1)
        uint256 pastTime = 1;
        
        vm.prank(user1);
        vm.expectRevert("Unlock time must be in the future");
        timelock.deposit{value: 1 ether}(pastTime);
    }
    
    // 🎯 QUEST 3: WITHDRAW TESTS
    
    function testWithdraw() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 1 ether;
        
        // Setup: Deposit first
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Move time forward past unlock time
        vm.warp(unlockTime + 1);
        
        // Check state BEFORE withdrawal
        uint256 userBalanceBefore = user1.balance;
        uint256 contractBalanceBefore = address(timelock).balance;
        (uint256 vaultBalanceBefore,, bool activeBefore, bool isUnlockedBefore) = 
            timelock.getVault(user1, 0);
        
        assertEq(userBalanceBefore, 999 ether, "User should have 999 ether after deposit");
        assertEq(contractBalanceBefore, 1 ether, "Contract should have 1 ether");
        assertEq(vaultBalanceBefore, depositAmount, "Vault should have deposit amount");
        assertTrue(activeBefore, "Vault should be active before withdrawal");
        assertTrue(isUnlockedBefore, "Vault should be unlocked");
        
        // Perform action: Withdraw
        vm.prank(user1);
        timelock.withdraw(0);
        
        // Check state AFTER withdrawal
        uint256 userBalanceAfter = user1.balance;
        uint256 contractBalanceAfter = address(timelock).balance;
        (uint256 vaultBalanceAfter,, bool activeAfter,) = timelock.getVault(user1, 0);
        
        // Assert all state changes
        assertEq(vaultBalanceAfter, 0, "Vault balance should be 0 after withdrawal");
        assertFalse(activeAfter, "Vault should be inactive after withdrawal");
        assertEq(userBalanceAfter - userBalanceBefore, depositAmount, "User should receive deposit amount");
        assertEq(contractBalanceBefore - contractBalanceAfter, depositAmount, "Contract balance should decrease");
        assertEq(userBalanceAfter, 1000 ether, "User should have original 1000 ether back");
        assertEq(contractBalanceAfter, 0, "Contract should have 0 balance");
    }
    
    function testWithdrawRevertsBeforeUnlockTime() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // Deposit
        vm.prank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        
        // Try to withdraw before unlock time (don't warp time)
        vm.prank(user1);
        vm.expectRevert("Funds are still locked");
        timelock.withdraw(0);
    }
    
    function testWithdrawRevertsForInvalidVaultId() public {
        // Try to withdraw a vault that doesn't exist
        vm.prank(user1);
        vm.expectRevert("Invalid vault ID");
        timelock.withdraw(0);
    }
    
    function testCannotWithdrawOtherUsersVault() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // user1 deposits
        vm.prank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        
        // Move time forward
        vm.warp(unlockTime + 1);
        
        // user2 tries to withdraw user1's vault
        // user2 has no vaults, so vault ID 0 is invalid for them
        vm.prank(user2);
        vm.expectRevert("Invalid vault ID");
        timelock.withdraw(0);
    }
    
    // 🎯 QUEST 4: WITHDRAW ALL TESTS
    
    function testWithdrawAll() public {
        // Create 3 vaults with different unlock times
        uint256 unlockTime1 = block.timestamp + 1 hours;
        uint256 unlockTime2 = block.timestamp + 2 hours;
        uint256 unlockTime3 = block.timestamp + 10 hours;
        
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime1);
        timelock.deposit{value: 2 ether}(unlockTime2);
        timelock.deposit{value: 3 ether}(unlockTime3);
        vm.stopPrank();
        
        // Move time to unlock first 2 vaults only
        vm.warp(unlockTime2 + 1);
        
        // Check state BEFORE withdrawAll
        uint256 userBalanceBefore = user1.balance;
        uint256 contractBalanceBefore = address(timelock).balance;
        uint256 totalBalanceBefore = timelock.getTotalBalance(user1);
        uint256 unlockedBalanceBefore = timelock.getUnlockedBalance(user1);
        (,, bool active1Before,) = timelock.getVault(user1, 0);
        (,, bool active2Before,) = timelock.getVault(user1, 1);
        (,, bool active3Before,) = timelock.getVault(user1, 2);
        
        assertEq(userBalanceBefore, 994 ether, "User should have 994 ether after 3 deposits");
        assertEq(contractBalanceBefore, 6 ether, "Contract should have 6 ether");
        assertEq(totalBalanceBefore, 6 ether, "Total balance should be 6 ether");
        assertEq(unlockedBalanceBefore, 3 ether, "Unlocked balance should be 3 ether (1+2)");
        assertTrue(active1Before, "Vault 1 should be active");
        assertTrue(active2Before, "Vault 2 should be active");
        assertTrue(active3Before, "Vault 3 should be active");
        
        // Perform action: Withdraw all unlocked vaults
        vm.prank(user1);
        uint256 totalWithdrawn = timelock.withdrawAll();
        
        // Check state AFTER withdrawAll
        uint256 userBalanceAfter = user1.balance;
        uint256 contractBalanceAfter = address(timelock).balance;
        uint256 totalBalanceAfter = timelock.getTotalBalance(user1);
        (,, bool active1After,) = timelock.getVault(user1, 0);
        (,, bool active2After,) = timelock.getVault(user1, 1);
        (,, bool active3After,) = timelock.getVault(user1, 2);
        
        // Assert all state changes
        assertEq(totalWithdrawn, 3 ether, "Should withdraw 3 ether total");
        assertEq(userBalanceAfter - userBalanceBefore, 3 ether, "User should receive 3 ether");
        assertEq(contractBalanceBefore - contractBalanceAfter, 3 ether, "Contract should lose 3 ether");
        assertEq(userBalanceAfter, 997 ether, "User should have 997 ether");
        assertEq(contractBalanceAfter, 3 ether, "Contract should have 3 ether left");
        assertEq(totalBalanceAfter, 3 ether, "Total balance should be 3 ether (only vault 3)");
        assertFalse(active1After, "Vault 1 should be inactive");
        assertFalse(active2After, "Vault 2 should be inactive");
        assertTrue(active3After, "Vault 3 should still be active (locked)");
    }
    
    function testWithdrawAllRevertsWithNoUnlockedFunds() public {
        // Create vaults that are still locked
        uint256 unlockTime = block.timestamp + 10 hours;
        
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        timelock.deposit{value: 2 ether}(unlockTime);
        vm.stopPrank();
        
        // Try to withdrawAll without moving time forward
        vm.prank(user1);
        vm.expectRevert("No unlocked funds available");
        timelock.withdrawAll();
    }
    
    // 🎯 QUEST 5: VIEW FUNCTION TESTS
    
    function testGetTotalBalance() public {
        // Create multiple vaults
        uint256 unlockTime = block.timestamp + 1 hours;
        
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        timelock.deposit{value: 2 ether}(unlockTime);
        timelock.deposit{value: 3 ether}(unlockTime);
        vm.stopPrank();
        
        // Check total balance
        uint256 totalBalance = timelock.getTotalBalance(user1);
        assertEq(totalBalance, 6 ether, "Total balance should be 6 ether");
    }
    
    function testGetUnlockedBalance() public {
        // Create vaults with different unlock times
        uint256 unlockTime1 = block.timestamp + 1 hours;
        uint256 unlockTime2 = block.timestamp + 2 hours;
        uint256 unlockTime3 = block.timestamp + 10 hours;
        
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime1);
        timelock.deposit{value: 2 ether}(unlockTime2);
        timelock.deposit{value: 3 ether}(unlockTime3);
        vm.stopPrank();
        
        // Before any unlock
        uint256 unlockedBefore = timelock.getUnlockedBalance(user1);
        assertEq(unlockedBefore, 0, "No funds should be unlocked yet");
        
        // Move time to unlock first 2 vaults
        vm.warp(unlockTime2 + 1);
        
        // Check unlocked balance
        uint256 unlockedAfter = timelock.getUnlockedBalance(user1);
        assertEq(unlockedAfter, 3 ether, "Should have 3 ether unlocked (1 + 2)");
    }
    
    function testGetVault() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 5 ether;
        
        // Create a vault
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Get vault details
        (uint256 balance, uint256 unlock, bool active, bool isUnlocked) = 
            timelock.getVault(user1, 0);
        
        assertEq(balance, depositAmount, "Balance should match deposit");
        assertEq(unlock, unlockTime, "Unlock time should match");
        assertTrue(active, "Vault should be active");
        assertFalse(isUnlocked, "Vault should not be unlocked yet");
        
        // Move time forward
        vm.warp(unlockTime + 1);
        
        // Check again
        (,,,bool isUnlockedNow) = timelock.getVault(user1, 0);
        assertTrue(isUnlockedNow, "Vault should be unlocked now");
    }
    
    // 🏆 BONUS QUESTS (Optional Challenges!)
    
    function testMultipleUsersCanHaveVaults() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // User1 deposits
        vm.prank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        
        // User2 deposits
        vm.prank(user2);
        timelock.deposit{value: 2 ether}(unlockTime);
        
        // Check user1's vault
        (uint256 balance1,,,) = timelock.getVault(user1, 0);
        assertEq(balance1, 1 ether, "User1 vault should have 1 ether");
        
        // Check user2's vault
        (uint256 balance2,,,) = timelock.getVault(user2, 0);
        assertEq(balance2, 2 ether, "User2 vault should have 2 ether");
        
        // Check vault counts
        uint256 count1 = timelock.getVaultCount(user1);
        uint256 count2 = timelock.getVaultCount(user2);
        assertEq(count1, 1, "User1 should have 1 vault");
        assertEq(count2, 1, "User2 should have 1 vault");
    }
    
    function testDepositEmitsEvent() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 1 ether;
        
        // Expect event with these parameters
        vm.expectEmit(true, false, false, true);
        emit Deposited(user1, 0, depositAmount, unlockTime);
        
        // Make the call that should emit the event
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
    }
    
    function testWithdrawEmitsEvent() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 1 ether;
        
        // Deposit first
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Move time forward
        vm.warp(unlockTime + 1);
        
        // Expect withdraw event
        vm.expectEmit(true, false, false, true);
        emit Withdrawn(user1, 0, depositAmount);
        
        // Withdraw
        vm.prank(user1);
        timelock.withdraw(0);
    }
    
    function testBalanceChangesOnDeposit() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 1 ether;
        
        // Check state BEFORE deposit
        uint256 userBalanceBefore = user1.balance;
        uint256 contractBalanceBefore = address(timelock).balance;
        
        assertEq(userBalanceBefore, 1000 ether, "User should start with 1000 ether");
        assertEq(contractBalanceBefore, 0, "Contract should start with 0 balance");
        
        // Perform action: deposit
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Check state AFTER deposit
        uint256 userBalanceAfter = user1.balance;
        uint256 contractBalanceAfter = address(timelock).balance;
        
        // Assert state changes
        assertEq(userBalanceBefore - userBalanceAfter, depositAmount, "User balance should decrease");
        assertEq(contractBalanceAfter - contractBalanceBefore, depositAmount, "Contract balance should increase");
        assertEq(userBalanceAfter, 999 ether, "User should have 999 ether");
        assertEq(contractBalanceAfter, 1 ether, "Contract should have 1 ether");
    }
    
    function testBalanceChangesOnWithdraw() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 1 ether;
        
        // Setup: Deposit first
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Move time forward
        vm.warp(unlockTime + 1);
        
        // Check state BEFORE withdraw
        uint256 userBalanceBefore = user1.balance;
        uint256 contractBalanceBefore = address(timelock).balance;
        
        assertEq(userBalanceBefore, 999 ether, "User should have 999 ether after deposit");
        assertEq(contractBalanceBefore, 1 ether, "Contract should have 1 ether");
        
        // Perform action: Withdraw
        vm.prank(user1);
        timelock.withdraw(0);
        
        // Check state AFTER withdraw
        uint256 userBalanceAfter = user1.balance;
        uint256 contractBalanceAfter = address(timelock).balance;
        
        // Assert state changes
        assertEq(userBalanceAfter - userBalanceBefore, depositAmount, "User balance should increase");
        assertEq(contractBalanceBefore - contractBalanceAfter, depositAmount, "Contract balance should decrease");
        assertEq(userBalanceAfter, 1000 ether, "User should have 1000 ether back");
        assertEq(contractBalanceAfter, 0, "Contract should have 0 ether");
    }
    
    function testGetActiveVaults() public {
        uint256 unlockTime1 = block.timestamp + 1 hours;
        uint256 unlockTime2 = block.timestamp + 2 hours;
        
        // Create 2 vaults
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime1);
        timelock.deposit{value: 2 ether}(unlockTime2);
        vm.stopPrank();
        
        // Get active vaults
        (uint[] memory activeVaults, uint[] memory balances, uint[] memory unlockTimes) = 
            timelock.getActiveVaults(user1);
        
        assertEq(activeVaults.length, 2, "Should have 2 active vaults");
        assertEq(balances[0], 1 ether, "First vault should have 1 ether");
        assertEq(balances[1], 2 ether, "Second vault should have 2 ether");
        assertEq(unlockTimes[0], unlockTime1, "First unlock time should match");
        assertEq(unlockTimes[1], unlockTime2, "Second unlock time should match");
    }
    
    function testGetAllVaults() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // Create 2 vaults
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        timelock.deposit{value: 2 ether}(unlockTime);
        vm.stopPrank();
        
        // Get all vaults
        TimeLockV1.Vault[] memory vaults = timelock.getAllVaults(user1);
        
        assertEq(vaults.length, 2, "Should have 2 vaults");
        assertEq(vaults[0].balance, 1 ether, "First vault balance");
        assertEq(vaults[1].balance, 2 ether, "Second vault balance");
    }
    
    function testGetVaultCount() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // Initially no vaults
        uint256 countBefore = timelock.getVaultCount(user1);
        assertEq(countBefore, 0, "Should have 0 vaults initially");
        
        // Create 3 vaults
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        timelock.deposit{value: 2 ether}(unlockTime);
        timelock.deposit{value: 3 ether}(unlockTime);
        vm.stopPrank();
        
        // Check count
        uint256 countAfter = timelock.getVaultCount(user1);
        assertEq(countAfter, 3, "Should have 3 vaults");
    }
    
    // 🎯 ADDITIONAL TESTS FOR COMPLETE COVERAGE
    
    function testCannotWithdrawFromInactiveVault() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // Deposit and withdraw to make vault inactive
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        vm.warp(unlockTime + 1);
        timelock.withdraw(0);
        
        // Try to withdraw again from inactive vault
        vm.expectRevert("Vault is not active");
        timelock.withdraw(0);
        vm.stopPrank();
    }
    
    function testCannotWithdrawFromZeroBalanceVault() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // Deposit and withdraw
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        vm.warp(unlockTime + 1);
        timelock.withdraw(0);
        
        // Vault is now inactive with zero balance
        (uint256 balance,, bool active,) = timelock.getVault(user1, 0);
        assertEq(balance, 0, "Vault balance should be 0");
        assertFalse(active, "Vault should be inactive");
        vm.stopPrank();
    }
    
    function testVaultStateChangesAfterWithdraw() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 5 ether;
        
        // Deposit
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Check initial state
        (uint256 balanceBefore, uint256 unlockBefore, bool activeBefore, bool isUnlockedBefore) = 
            timelock.getVault(user1, 0);
        assertEq(balanceBefore, depositAmount, "Initial balance should match deposit");
        assertEq(unlockBefore, unlockTime, "Unlock time should match");
        assertTrue(activeBefore, "Vault should be active");
        assertFalse(isUnlockedBefore, "Vault should be locked initially");
        
        // Move time and withdraw
        vm.warp(unlockTime + 1);
        vm.prank(user1);
        timelock.withdraw(0);
        
        // Check state after withdrawal
        (uint256 balanceAfter,, bool activeAfter,) = timelock.getVault(user1, 0);
        assertEq(balanceAfter, 0, "Balance should be 0 after withdrawal");
        assertFalse(activeAfter, "Vault should be inactive after withdrawal");
    }
    
    function testContractBalanceChanges() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // Initial contract balance should be 0
        assertEq(address(timelock).balance, 0, "Contract should start with 0 balance");
        
        // User1 deposits 1 ether
        vm.prank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        assertEq(address(timelock).balance, 1 ether, "Contract should have 1 ether");
        
        // User2 deposits 2 ether
        vm.prank(user2);
        timelock.deposit{value: 2 ether}(unlockTime);
        assertEq(address(timelock).balance, 3 ether, "Contract should have 3 ether");
        
        // User1 withdraws
        vm.warp(unlockTime + 1);
        vm.prank(user1);
        timelock.withdraw(0);
        assertEq(address(timelock).balance, 2 ether, "Contract should have 2 ether after user1 withdrawal");
        
        // User2 withdraws
        vm.prank(user2);
        timelock.withdraw(0);
        assertEq(address(timelock).balance, 0, "Contract should have 0 ether after all withdrawals");
    }
    
    function testInitialUserBalances() public view {
        // Check that users were given correct initial balances in setUp
        assertEq(user1.balance, 1000 ether, "User1 should have 1000 ether initially");
        assertEq(user2.balance, 1000 ether, "User2 should have 1000 ether initially");
    }
    
    function testUserBalanceDecreasesOnDeposit() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 10 ether;
        
        // Check state BEFORE deposit
        uint256 initialBalance = user1.balance;
        assertEq(initialBalance, 1000 ether, "User should start with 1000 ether");
        
        // Perform action: deposit
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Check state AFTER deposit
        uint256 finalBalance = user1.balance;
        
        // Assert state changes
        assertEq(initialBalance - finalBalance, depositAmount, "User balance should decrease by deposit amount");
        assertEq(finalBalance, 990 ether, "User should have 990 ether after depositing 10");
    }
    
    function testUserBalanceIncreasesOnWithdraw() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        uint256 depositAmount = 10 ether;
        
        // Setup: Deposit
        vm.prank(user1);
        timelock.deposit{value: depositAmount}(unlockTime);
        
        // Check state BEFORE withdraw
        uint256 balanceAfterDeposit = user1.balance;
        assertEq(balanceAfterDeposit, 990 ether, "User should have 990 ether after deposit");
        
        // Move time forward
        vm.warp(unlockTime + 1);
        
        // Perform action: Withdraw
        vm.prank(user1);
        timelock.withdraw(0);
        
        // Check state AFTER withdraw
        uint256 balanceAfterWithdraw = user1.balance;
        
        // Assert state changes
        assertEq(balanceAfterWithdraw, 1000 ether, "User should have 1000 ether after withdrawal");
        assertEq(balanceAfterWithdraw - balanceAfterDeposit, depositAmount, "Balance increase should equal deposit amount");
    }
    
    function testMultipleDepositsStateChanges() public {
        uint256 unlockTime = block.timestamp + 1 hours;
        
        // Check state BEFORE deposits
        uint256 initialBalance = user1.balance;
        uint256 initialContractBalance = address(timelock).balance;
        uint256 initialVaultCount = timelock.getVaultCount(user1);
        uint256 initialTotalBalance = timelock.getTotalBalance(user1);
        
        assertEq(initialBalance, 1000 ether, "User should start with 1000 ether");
        assertEq(initialContractBalance, 0, "Contract should start with 0 balance");
        assertEq(initialVaultCount, 0, "User should have 0 vaults initially");
        assertEq(initialTotalBalance, 0, "Total balance should be 0 initially");
        
        // Perform action: Make 3 deposits
        vm.startPrank(user1);
        timelock.deposit{value: 1 ether}(unlockTime);
        timelock.deposit{value: 2 ether}(unlockTime);
        timelock.deposit{value: 3 ether}(unlockTime);
        vm.stopPrank();
        
        // Check state AFTER deposits
        uint256 finalBalance = user1.balance;
        uint256 finalContractBalance = address(timelock).balance;
        uint256 finalVaultCount = timelock.getVaultCount(user1);
        uint256 finalTotalBalance = timelock.getTotalBalance(user1);
        
        // Assert state changes
        assertEq(initialBalance - finalBalance, 6 ether, "User balance should decrease by 6 ether");
        assertEq(finalContractBalance - initialContractBalance, 6 ether, "Contract balance should increase by 6 ether");
        assertEq(finalBalance, 994 ether, "User should have 994 ether");
        assertEq(finalContractBalance, 6 ether, "Contract should have 6 ether");
        assertEq(finalVaultCount, 3, "Should have 3 vaults");
        assertEq(finalTotalBalance, 6 ether, "Total balance should be 6 ether");
    }
    
    function testWithdrawAllStateChanges() public {
        uint256 unlockTime1 = block.timestamp + 1 hours;
        uint256 unlockTime2 = block.timestamp + 2 hours;
        
        // Setup: Create 2 vaults
        vm.startPrank(user1);
        timelock.deposit{value: 3 ether}(unlockTime1);
        timelock.deposit{value: 5 ether}(unlockTime2);
        vm.stopPrank();
        
        // Unlock both
        vm.warp(unlockTime2 + 1);
        
        // Check state BEFORE withdrawAll
        uint256 balanceBeforeWithdraw = user1.balance;
        uint256 contractBalanceBefore = address(timelock).balance;
        uint256 totalBalanceBefore = timelock.getTotalBalance(user1);
        uint256 unlockedBalanceBefore = timelock.getUnlockedBalance(user1);
        (,, bool active1Before,) = timelock.getVault(user1, 0);
        (,, bool active2Before,) = timelock.getVault(user1, 1);
        
        assertEq(balanceBeforeWithdraw, 992 ether, "User should have 992 ether after deposits");
        assertEq(contractBalanceBefore, 8 ether, "Contract should have 8 ether");
        assertEq(totalBalanceBefore, 8 ether, "Total balance should be 8 ether");
        assertEq(unlockedBalanceBefore, 8 ether, "All funds should be unlocked");
        assertTrue(active1Before, "Vault 1 should be active");
        assertTrue(active2Before, "Vault 2 should be active");
        
        // Perform action: withdraw all
        vm.prank(user1);
        uint256 totalWithdrawn = timelock.withdrawAll();
        
        // Check state AFTER withdrawAll
        uint256 balanceAfterWithdraw = user1.balance;
        uint256 contractBalanceAfter = address(timelock).balance;
        uint256 totalBalanceAfter = timelock.getTotalBalance(user1);
        (,, bool active1After,) = timelock.getVault(user1, 0);
        (,, bool active2After,) = timelock.getVault(user1, 1);
        
        // Assert state changes
        assertEq(totalWithdrawn, 8 ether, "Should withdraw 8 ether total");
        assertEq(balanceAfterWithdraw - balanceBeforeWithdraw, 8 ether, "User should receive 8 ether");
        assertEq(contractBalanceBefore - contractBalanceAfter, 8 ether, "Contract should lose 8 ether");
        assertEq(balanceAfterWithdraw, 1000 ether, "User should have 1000 ether back");
        assertEq(contractBalanceAfter, 0, "Contract should have 0 ether");
        assertEq(totalBalanceAfter, 0, "Total balance should be 0");
        assertFalse(active1After, "Vault 1 should be inactive");
        assertFalse(active2After, "Vault 2 should be inactive");
    }
    
    function testGetVaultRevertsForInvalidId() public {
        // Try to get a vault that doesn't exist
        vm.expectRevert("Invalid vault ID");
        timelock.getVault(user1, 0);
        
        // Create one vault
        vm.prank(user1);
        timelock.deposit{value: 1 ether}(block.timestamp + 1 hours);
        
        // Try to get vault ID 1 (doesn't exist)
        vm.expectRevert("Invalid vault ID");
        timelock.getVault(user1, 1);
    }
}
