// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Test, console} from 'forge-std/Test.sol';
import {Vul} from '../src/Vul.sol';
import {VulAttack} from '../src/VulAttack.sol';

contract VulExploitTest is Test {
  Vul vault;
  VulAttack attackContract;

  address attacker = makeAddr('attacker');
  address shogo = makeAddr('shogo');

  uint256 constant ATTACK_STAKE = 1 ether;
  uint256 constant SHOGO_DEPOSIT = 2 ether;

  function setUp() public {
    vault = new Vul();

    vm.deal(attacker, ATTACK_STAKE);

    vm.prank(attacker);
    attackContract = new VulAttack(address(vault));
  }

  function test_reentrancy_drainsVault() public {
    uint256 vulnerableVaultBefore = address(vault).balance;
    uint256 attackerAmountBefore = vault.balances(address(attacker));
    uint256 attackerVaultBefore = address(attackContract).balance;

    console.log(
      'Vulnerable Vault balance before:',
      vulnerableVaultBefore / 1e18,
      'ETH'
    );
    console.log(
      'Attacker Vault balance before:',
      attackerVaultBefore / 1e18,
      'ETH'
    );
    console.log('Attacker balance before:', attackerAmountBefore / 1e18, 'ETH');

    vm.prank(attacker);
    attackContract.depositValue{value: ATTACK_STAKE}();

    uint256 vulnerableVaultAfterDeposit = address(vault).balance;
    uint256 attackerAmountAfterDeposit = address(attacker).balance;
    uint256 attackerVaultAfterDeposit = address(attackContract).balance;

    console.log(
      'Vulnerable Vault balance after:',
      vulnerableVaultAfterDeposit / 1e18,
      'ETH'
    );
    console.log(
      'Attacker Vault balance after:',
      attackerAmountAfterDeposit / 1e18,
      'ETH'
    );
    console.log(
      'Attacker balance after:',
      attackerVaultAfterDeposit / 1e18,
      'ETH'
    );

    assertEq(
      vulnerableVaultAfterDeposit,
      ATTACK_STAKE,
      'Vault have eth deposited by attacker'
    );
    assertEq(attackerVaultAfterDeposit, 0, 'Vault should still be empty');

    vm.prank(attacker);
    attackContract.attack(ATTACK_STAKE);

    uint256 vulnerableVaultAfterAttack = address(vault).balance;
    uint256 attackerVaultAfterAttack = address(attackContract).balance;

    console.log(
      'Vulnerable Vault balance after attack:',
      vulnerableVaultAfterAttack / 1e18,
      'ETH'
    );
    console.log(
      'Attacker Vault balance after attack:',
      attackerVaultAfterAttack / 1e18,
      'ETH'
    );

    assertEq(
      vulnerableVaultAfterAttack,
      0,
      'Vault should be fully drained after attack'
    );
    assertEq(
      attackerVaultAfterAttack,
      ATTACK_STAKE,
      'Attacker Vault should be same as stake'
    );

    vm.prank(attacker);
    attackContract.drain();

    uint256 vulnerableVaultAfterDrain = address(vault).balance;
    uint256 attackerAmountAfterDrain = address(attacker).balance;
    uint256 attackerVaultAfterDrain = address(attackContract).balance;

    console.log(
      'Vulnerable Vault balance after attack:',
      vulnerableVaultAfterDrain / 1e18,
      'ETH'
    );
    console.log(
      'Attacker Vault balance after attack:',
      attackerVaultAfterDrain / 1e18,
      'ETH'
    );
    console.log(
      'Attacker  balance after attack:',
      attackerAmountAfterDrain / 1e18,
      'ETH'
    );

    assertEq(
      vulnerableVaultAfterDrain,
      0,
      'Vault should be fully drained after drain'
    );

    assertEq(
      attackerVaultAfterDrain,
      0,
      'Attacker Vault should be fully drained after drain'
    );

    assertEq(
      attackerAmountAfterDrain,
      ATTACK_STAKE,
      'Attacker balance Vault should be the same as stake after drain'
    );
  }

  //   function test_reentrancy_victimsCannotWithdraw() public {
  //     vm.prank(shogo);
  //     vault.deposit{value: SHOGO_DEPOSIT}();

  //     vm.prank(attacker);
  //     attackContract.depositValue{value: ATTACK_STAKE}();
  //     attackContract.attack(ATTACK_STAKE);

  //     uint256 vulnerableVaultAfterAttack = address(vault).balance;

  //     console.log(
  //       'Vulnerable Vault balance after attack:',
  //       vulnerableVaultAfterAttack / 1e18,
  //       'ETH'
  //     );

  //     console.log(
  //       'Shogo balance in vault after attack:',
  //       vault.balances(shogo) / 1e18,
  //       'ETH'
  //     );

  //     assertEq(
  //       vault.balances(shogo),
  //       SHOGO_DEPOSIT,
  //       'Ledger untouched (bug: no deduction)'
  //     );
  //     assertEq(vulnerableVaultAfterAttack, 0, 'Vault is empty');

  //     vm.prank(shogo);
  //     vm.expectRevert('Transfer failed');
  //     vault.withdraw(SHOGO_DEPOSIT);
  //   }
}
