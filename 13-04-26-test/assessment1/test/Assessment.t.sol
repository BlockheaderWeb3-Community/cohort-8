// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from 'forge-std/Test.sol';
import '../src/AssessmentContract.sol';

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
  function test_if_deployment_initialBalance_isZero() public view {
    // uint256 contractBalance = vulnerableContract.balances;
    assertEq(vulnerableContract.balances(owner), 0);
  }

  function test_deposit_will_updateBalance() public {
    vm.prank(owner);
    vulnerableContract.deposit{value: 1 ether}();
    assertEq(vulnerableContract.balances(owner), 1 ether);
  }

  function test_withdraw_will_reduceBalance() public {
    vm.prank(owner);
    vulnerableContract.deposit{value: 1 ether}();

    vm.prank(owner);
    vulnerableContract.withdraw(1 ether);

    assertEq(vulnerableContract.balances(owner), 0);
  }

  function test_withdraw_revertsIfInsufficientBalance() public {
    vm.prank(owner);
    vm.expectRevert('Insufficient balance');
    vulnerableContract.withdraw(1 ether);
  }

  // === Reentrancy attack
  function test_reentrancyAttack_to_drain_vulnerable_contract() public {
    // I'm depositing into the contract
    vm.prank(owner);
    vulnerableContract.deposit{value: 5 ether}();

    // Initial balances
    uint256 contractInitialBalance = address(vulnerableContract).balance;
    uint256 attackerInitialBalance = address(attackerContract).balance;

    vm.prank(attacker);
    attackerContract.exploit{value: 1 ether}();

    Attacker may now drain more than they put in
    assertGt(
      address(attackerContract).balance,
      attackerBalanceBefore + 1 ether,
      "Attacker should have drained extra ETH"
    );
    assertLt(
      address(vulnerableContract).balance,
      contractBalanceBefore,
      "Vulnerable contract should have lost ETH"
    );
  }

  // === Fixed Contract Tests
  function test_if_fixed_deployment_initialBalance_isZero() public view {
    assertEq(fixedContract.balances(user), 0);
  }

  function test_fixed_deposit_will_updateBalance() public {
    vm.prank(user);
    fixedContract.deposit{value: 1 ether}();
    assertEq(fixedContract.balances(user), 1 ether);
  }

  function test_fixed_withdraw_will_reduceBalance() public {
    vm.prank(user);
    fixedContract.deposit{value: 1 ether}();

    vm.prank(user);
    fixedContract.withdraw(1 ether);

    assertEq(vulnerableContract.balances(user), 0);
  }

  function test_fixed_withdraw_revertsIfInsufficientBalance() public {
    vm.prank(user);
    vm.expectRevert('Insufficient balance');
    fixedContract.withdraw(1 ether);
  }
}
