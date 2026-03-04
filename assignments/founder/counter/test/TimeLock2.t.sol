// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TimeLock} from "../src/TimeLock2.sol";

contract TimeLock2Test is Test {
    TimeLock public timelock;

    uint256 internal constant ONE_DAY_IN_SECS = 24 * 60 * 60;
    uint256 internal constant DEPOSIT_AMOUNT = 1 ether;

    event Deposited(address indexed user, uint256 vaultId, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 vaultId, uint256 amount);

    receive() external payable {}

    function setUp() public {
        timelock = new TimeLock();
        vm.deal(address(this), 100 ether);
    }

    function test_ShouldCreateVaultWithCorrectBalanceAndUnlockTime() public {
        uint256 unlockTime = block.timestamp + ONE_DAY_IN_SECS;

        vm.expectEmit(true, false, false, true);
        emit Deposited(address(this), 0, DEPOSIT_AMOUNT, unlockTime);
        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        (uint256 balance, uint256 storedUnlockTime, bool active, ) = timelock.getVault(address(this), 0);
        assertEq(balance, DEPOSIT_AMOUNT);
        assertEq(storedUnlockTime, unlockTime);
        assertTrue(active);
    }

    function test_ShouldRevertIfDepositIs0() public {
        uint256 unlockTime = block.timestamp + ONE_DAY_IN_SECS;

        vm.expectRevert("Deposit must be greater than zero");
        timelock.deposit{value: 0}(unlockTime);
    }

    function test_ShouldRevertIfUnlockTimeIsInThePast() public {
        uint256 pastTime = block.timestamp;

        vm.expectRevert("Unlock time must be in the future");
        timelock.deposit{value: DEPOSIT_AMOUNT}(pastTime);
    }

    function test_ShouldFailIfFundsAreStillLocked() public {
        uint256 unlockTime = block.timestamp + ONE_DAY_IN_SECS;

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.expectRevert("Funds are still locked");
        timelock.withdraw(0);
    }

    function test_ShouldSucceedIfUnlockTimeHasPassed() public {
        uint256 unlockTime = block.timestamp + ONE_DAY_IN_SECS;

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.warp(unlockTime);

        vm.expectEmit(true, false, false, true);
        emit Withdrawn(address(this), 0, DEPOSIT_AMOUNT);
        timelock.withdraw(0);

        (uint256 balance, , bool active, ) = timelock.getVault(address(this), 0);
        assertFalse(active);
        assertEq(balance, 0);
    }

    function test_ShouldFailIfTryingToWithdrawFromAnInactiveVault() public {
        uint256 unlockTime = block.timestamp + ONE_DAY_IN_SECS;

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);
        vm.warp(unlockTime);
        timelock.withdraw(0);

        vm.expectRevert("Vault is not active");
        timelock.withdraw(0);
    }

    function test_ShouldWithdrawFromMultipleUnlockedVaultsAtOnce() public {
        uint256 nowTime = block.timestamp;

        timelock.deposit{value: DEPOSIT_AMOUNT}(nowTime + ONE_DAY_IN_SECS);
        timelock.deposit{value: DEPOSIT_AMOUNT}(nowTime + ONE_DAY_IN_SECS * 2);
        timelock.deposit{value: DEPOSIT_AMOUNT}(nowTime + ONE_DAY_IN_SECS * 10);

        vm.warp(nowTime + ONE_DAY_IN_SECS * 3);

        uint256 expectedTransfer = DEPOSIT_AMOUNT * 2;
        uint256 balanceBefore = address(this).balance;

        uint256 withdrawn = timelock.withdrawAll();

        assertEq(withdrawn, expectedTransfer);
        assertEq(address(this).balance, balanceBefore + expectedTransfer);
        assertEq(timelock.getTotalBalance(address(this)), DEPOSIT_AMOUNT);
    }

    function test_ShouldRevertIfNoVaultsAreReadyForWithdrawal() public {
        uint256 unlockTime = block.timestamp + ONE_DAY_IN_SECS;

        timelock.deposit{value: DEPOSIT_AMOUNT}(unlockTime);

        vm.expectRevert("No unlocked funds available");
        timelock.withdrawAll();
    }

    function test_ShouldCorrectlyTrackTotalAndUnlockedBalances() public {
        uint256 nowTime = block.timestamp;

        timelock.deposit{value: 1 ether}(nowTime + 100);
        timelock.deposit{value: 2 ether}(nowTime + 1000);

        assertEq(timelock.getTotalBalance(address(this)), 3 ether);
        assertEq(timelock.getUnlockedBalance(address(this)), 0);

        vm.warp(nowTime + 200);
        assertEq(timelock.getUnlockedBalance(address(this)), 1 ether);
    }

    function test_ShouldReturnOnlyActiveVaultsData() public {
        uint256 nowTime = block.timestamp;

        timelock.deposit{value: DEPOSIT_AMOUNT}(nowTime + 100);
        timelock.deposit{value: DEPOSIT_AMOUNT}(nowTime + 200);

        vm.warp(nowTime + 150);
        timelock.withdraw(0);

        (uint256[] memory activeVaults, , ) = timelock.getActiveVaults(address(this));
        assertEq(activeVaults.length, 1);
        assertEq(activeVaults[0], 1);
    }
}
