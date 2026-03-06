//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {TimeLockV2} from "../src/TimelockV2.sol";
import {HENTU} from "../src/token.sol";

contract TimeLockV2Test is Test {
    TimeLockV2 public timelock;
    HENTU public henToken;
    uint256 amountMinted;

    address public addr1 = makeAddr("addr1");
    address public addr2 = makeAddr("addr2");
    address public owner = makeAddr("owner");

    uint256 public constant DEPOSIT_AMOUNT = 1 ether;
    uint256 public constant TOKEN_RATIO = 10;

    // Events from TimeLockV2
    event Deposited(address indexed user, uint256 vaultId, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 vaultId, uint256 amount);

    function setUp() public {
        vm.startPrank(owner);
        henToken = new HENTU(address(this), address(this));
        timelock = new TimeLockV2(address(henToken));
        vm.stopPrank();

        amountMinted = 1000000 * 10 ** henToken.decimals();
        henToken.mint(address(timelock), amountMinted);
    }

    function test_emergencyWithdraw() public {
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 ownerBalanceBefore = owner.balance;

        vm.deal(addr2, 1 ether);
        vm.prank(addr2);
        timelock.deposit{value: 1 ether}(unlockTime);

        vm.prank(owner);
        uint256 withdrawnAmount = timelock.emergencyWithdraw();

        assertEq(withdrawnAmount, 1 ether);
        assertEq(address(timelock).balance, 0);
        assertEq(owner.balance, ownerBalanceBefore + 1 ether);
    }

    function testDeposit() public {
        vm.deal(addr1, 10 ether);

        uint256 depositAmount = 1 ether;
        uint256 tokenRatio = 10;

        uint256 unlockTime = block.timestamp + 1 days;
        uint256 expectedTokens = depositAmount * tokenRatio;

        vm.startPrank(addr1);

        //////
        uint256 addresTokenBalanceBefore = henToken.balanceOf(addr1);
        assertEq(addresTokenBalanceBefore, 0);

        uint256 addressETHBalanceBefore = addr1.balance;
        assertEq(addressETHBalanceBefore, 10 ether);

        uint256 contractTokenBalanceBefore = henToken.balanceOf(address(timelock));
        assertEq(contractTokenBalanceBefore, amountMinted);

        uint256 contractETHBalanceBefore = address(timelock).balance;
        assertEq(contractETHBalanceBefore, 0);
        ///////

        timelock.deposit{value: depositAmount}(unlockTime);

        uint256 vaultId = timelock.getVaultCount(addr1);
        // assert that a vault has been created after deposit
        assertEq(vaultId, 1);

        //////
        uint256 addresTokenBalanceAfter = henToken.balanceOf(addr1);
        assertEq(addresTokenBalanceAfter, expectedTokens);

        uint256 addressETHBalanceAfter = addr1.balance;
        assertEq(addressETHBalanceAfter, 9 ether);

        uint256 contractTokenBalanceAfter = henToken.balanceOf(address(timelock));
        assertEq(contractTokenBalanceAfter, amountMinted - expectedTokens);

        uint256 contractETHBalanceAfter = address(timelock).balance;
        assertEq(contractETHBalanceAfter, 1 ether);
        ///////

        assertEq(timelock.getVaultCount(addr1), 1);

        vm.stopPrank();
    }

    // Test deposit with zero value fails
    function testDepositZeroValueFails() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        vm.expectRevert("Deposit must be greater than zero");
        timelock.deposit{value: 0}(unlockTime);

        vm.stopPrank();
    }

    // Test deposit with past unlock time fails
    function testDepositPastUnlockTimeFails() public {
        vm.deal(addr1, 10 ether);
        uint256 depositAmount = 1 ether;

        uint256 unlockTime = block.timestamp - 1; // Past time

        vm.startPrank(addr1);

        vm.expectRevert("Unlock time must be in the future");
        timelock.deposit{value: depositAmount}(unlockTime);

        vm.stopPrank();
    }

    // Test successful withdrawal
    function testWithdraw() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 1 days;
        uint256 expectedTokens = DEPOSIT_AMOUNT * TOKEN_RATIO;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        uint256 vaultId = timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        uint256 userBalanceBefore = addr1.balance;
        uint256 userTokenBalanceBefore = henToken.balanceOf(addr1);

        vm.warp(unlockTime + 1);

        timelock.withdraw(vaultId);

        // Check ETH was returned
        assertEq(addr1.balance, userBalanceBefore + DEPOSIT_AMOUNT);

        // Check tokens were burned (transferred back)
        assertEq(henToken.balanceOf(addr1), userTokenBalanceBefore - expectedTokens);

        vm.stopPrank();
    }

    // Test withdrawal before unlock time fails
    function testWithdrawBeforeUnlockFails() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 7 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        uint256 vaultId = timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.expectRevert("Funds are still locked");
        timelock.withdraw(vaultId);

        vm.stopPrank();
    }

    // Test withdrawal with invalid vault ID fails
    function testWithdrawInvalidVaultIdFails() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.expectRevert("Invalid vault ID");
        timelock.withdraw(999); // Invalid vault ID

        vm.stopPrank();
    }

    // Test withdrawAll
    function testWithdrawAll() public {
        vm.deal(addr1, 100 ether);

        uint256 unlockTime1 = block.timestamp + 1 days;
        uint256 unlockTime2 = block.timestamp + 2 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        // Create multiple vaults
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime1);
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime2);

        // Warp to after first unlock time
        vm.warp(unlockTime1 + 1);

        uint256 balanceBefore = addr1.balance;

        // Withdraw all unlocked
        uint256 withdrawn = timelock.withdrawAll();

        // Only first vault should be unlocked
        assertEq(withdrawn, DEPOSIT_AMOUNT);
        assertEq(addr1.balance, balanceBefore + DEPOSIT_AMOUNT);

        vm.stopPrank();
    }

    // Test withdrawAll with no unlocked funds fails
    function testWithdrawAllNoUnlockedFails() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 7 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.expectRevert("No unlocked funds available");
        timelock.withdrawAll();

        vm.stopPrank();
    }

    // Test getVault function
    function testGetVault() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        uint256 vaultId = timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        (uint256 balance, uint256 unlockTimeRet, bool active, bool isUnlocked) = timelock.getVault(addr1, vaultId);

        assertEq(balance, DEPOSIT_AMOUNT);
        assertEq(unlockTimeRet, unlockTime);
        assertTrue(active);
        assertFalse(isUnlocked); // Not unlocked yet

        // Warp past unlock time
        vm.warp(unlockTime + 1);

        (,,, isUnlocked) = timelock.getVault(addr1, vaultId);
        assertTrue(isUnlocked);

        vm.stopPrank();
    }

    // Test getVaultCount
    function testGetVaultCount() public {
        vm.deal(addr1, 100 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        assertEq(timelock.getVaultCount(addr1), 0);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);
        assertEq(timelock.getVaultCount(addr1), 1);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);
        assertEq(timelock.getVaultCount(addr1), 2);

        vm.stopPrank();
    }

    // Test getTotalBalance
    function testGetTotalBalance() public {
        vm.deal(addr1, 100 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        assertEq(timelock.getTotalBalance(addr1), DEPOSIT_AMOUNT * 2);

        vm.stopPrank();
    }

    // Test getUnlockedBalance
    function testGetUnlockedBalance() public {
        vm.deal(addr1, 100 ether);

        uint256 unlockTime1 = block.timestamp + 1 days;
        uint256 unlockTime2 = block.timestamp + 2 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime1);
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime2);

        // Initially no unlocked balance
        assertEq(timelock.getUnlockedBalance(addr1), 0);

        // Warp past first unlock time
        vm.warp(unlockTime1 + 1);

        // Should have one vault unlocked
        assertEq(timelock.getUnlockedBalance(addr1), DEPOSIT_AMOUNT);

        // Warp past second unlock time
        vm.warp(unlockTime2 + 1);

        // Should have both vaults unlocked
        assertEq(timelock.getUnlockedBalance(addr1), DEPOSIT_AMOUNT * 2);

        vm.stopPrank();
    }

    // Test getActiveVaults
    function testGetActiveVaults() public {
        vm.deal(addr1, 100 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        (uint256[] memory activeVaults, uint256[] memory balances, uint256[] memory unlockTimes) =
            timelock.getActiveVaults(addr1);

        assertEq(activeVaults.length, 2);
        assertEq(balances.length, 2);
        assertEq(unlockTimes.length, 2);
        assertEq(activeVaults[0], 0);
        assertEq(activeVaults[1], 1);
        assertEq(balances[0], DEPOSIT_AMOUNT);
        assertEq(balances[1], DEPOSIT_AMOUNT);

        vm.stopPrank();
    }

    // Test getAllVaults
    function testGetAllVaults() public {
        vm.deal(addr1, 100 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        TimeLockV2.Vault[] memory allVaults = timelock.getAllVaults(addr1);

        assertEq(allVaults.length, 2);
        assertEq(allVaults[0].balance, DEPOSIT_AMOUNT);
        assertEq(allVaults[1].balance, DEPOSIT_AMOUNT);
        assertTrue(allVaults[0].active);
        assertTrue(allVaults[1].active);

        vm.stopPrank();
    }

    // Test multiple users have separate vaults
    function testMultipleUsersSeparateVaults() public {
        vm.deal(addr1, 10 ether);
        vm.deal(addr2, 10 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        // addr1 deposits
        vm.startPrank(addr1);
        henToken.approve(address(timelock), type(uint256).max);
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);
        vm.stopPrank();

        // addr2 deposits
        vm.startPrank(addr2);
        henToken.approve(address(timelock), type(uint256).max);
        timelock.deposit{value: DEPOSIT_AMOUNT * 2}(unlockTime);
        vm.stopPrank();

        // Check vault counts
        assertEq(timelock.getVaultCount(addr1), 1);
        assertEq(timelock.getVaultCount(addr2), 1);

        // Check balances
        assertEq(timelock.getTotalBalance(addr1), DEPOSIT_AMOUNT);
        assertEq(timelock.getTotalBalance(addr2), DEPOSIT_AMOUNT * 2);
    }

    // Test deposit event
    function testDepositEvent() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        // vm.expectEmit(true, true, true, true);
        emit Deposited(addr1, 0, DEPOSIT_AMOUNT, unlockTime);

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.stopPrank();
    }

    // Test withdraw event
    function testWithdrawEvent() public {
        vm.deal(addr1, 10 ether);

        uint256 unlockTime = block.timestamp + 1 days;

        vm.startPrank(addr1);

        henToken.approve(address(timelock), type(uint256).max);

        uint256 vaultId = timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.warp(unlockTime + 1);

        vm.expectEmit(true, true, true, true);
        emit Withdrawn(addr1, vaultId, DEPOSIT_AMOUNT);

        timelock.withdraw(vaultId);

        vm.stopPrank();
    }
}
