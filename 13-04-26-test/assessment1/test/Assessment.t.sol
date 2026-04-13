// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from 'forge-std/Test.sol';
import '../src/AssessmentContract.sol';
import {console} from "forge-std/console.sol";

contract AssessmentTest is Test {
  VulnerableContract public vulnerableContract;
  AttackerContract public attackerContract;
  FixedContract public fixedContract;

  address owner = makeAddr('owner');
  address attacker = makeAddr('attacker');
  address user = makeAddr('user');

  function setUp() public {
    vulnerableContract = new VulnerableContract();
    fixedContract = new FixedContract();
    attackerContract = new AttackerContract(address(vulnerableContract));

    vm.deal(owner, 10 ether);
    vm.deal(attacker, 2 ether);
    vm.deal(user, 2 ether);
  }

  // === Basic Deployment Tests
  function test_IfDeploymentInitialBalanceIsZero() public view {
    assertEq(vulnerableContract.balances(owner), 0);
  }

  function test_DepositWillUpdateBalance() public {
    vm.prank(owner);
    vulnerableContract.deposit{value: 1 ether}();
    assertEq(vulnerableContract.balances(owner), 1 ether);
  }

  function test_WithdrawWillReduceBalance() public {
    vm.prank(owner);
    vulnerableContract.deposit{value: 1 ether}();

    vm.prank(owner);
    vulnerableContract.withdraw(1 ether);

    assertEq(vulnerableContract.balances(owner), 0);
  }

  function test_WithdrawRevertsIfInsufficientBalance() public {
    vm.prank(owner);
    vm.expectRevert('Insufficient balance');
    vulnerableContract.withdraw(1 ether);
  }

  // === Reentrancy attack
  function test_ReentrancyAttackToDrainVulnerableContract() public {
    vm.prank(owner);
    vulnerableContract.deposit{value: 5 ether}();

    uint256 contractInitialBalance = address(vulnerableContract).balance;
    console.log("Vulnerable Contract Initial Balance: ", contractInitialBalance);
    uint256 attackerInitialBalance = address(attackerContract).balance;
    console.log("Attacker Initial Balance: ", attackerInitialBalance);

    vm.prank(attacker);
    attackerContract.exploit{value: 1 ether}();

    uint256 contractFinalBalance = address(vulnerableContract).balance;
    console.log("Vulnerable Contract Final Balance: ", contractFinalBalance);
    uint256 attackerFinalBalance = address(attackerContract).balance;
    console.log("Attacker final balance: ", attackerFinalBalance);

    assertGt(
      address(attackerContract).balance,
      attackerInitialBalance + 1 ether,
      "Attacker should have drained extra ETH"
    );
    assertLt(
      address(vulnerableContract).balance,
      contractInitialBalance,
      "Vulnerable contract should have lost ETH"
    );
  }

  // === Fixed Contract Tests
  function test_IfFixedDeploymentInitialBalanceIsZero() public view {
    assertEq(vulnerableContract.balances(owner), 0);
  }

  function test_FixedDepositWillUpdateBalance() public {
    vm.prank(user);
    fixedContract.deposit{value: 1 ether}();
    assertEq(fixedContract.balances(user), 1 ether);
  }

  function testFixedWithdrawWillReduceBalance() public {
    vm.prank(user);
    fixedContract.deposit{value: 1 ether}();

    vm.prank(user);
    fixedContract.withdraw(1 ether);

    assertEq(fixedContract.balances(user), 0);
  }

  function testFixedWithdrawRevertsIfInsufficientBalance() public {
    vm.prank(user);
    vm.expectRevert('Insufficient balance');
    fixedContract.withdraw(1 ether);
  }
}
