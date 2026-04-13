// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import "forge-std/Test.sol";
import "../src/fixed.sol";

// Malicious contract that tries to re-enter FixedVault.withdraw()
contract ReentrantAttacker {
    FixedVault public vault;
    uint256 public chunkSize;

    constructor(address _vault) {
        vault = FixedVault(payable(_vault));
    }

    function attack(uint256 _chunkSize) external payable {
        chunkSize = _chunkSize;
        vault.deposit{value: msg.value}();
        vault.withdraw(chunkSize);
    }

    receive() external payable {
        if (address(vault).balance >= chunkSize) {
            vault.withdraw(chunkSize); // should revert with "Reentrant call"
        }
    }
}

contract FixedVaultTest is Test {
    FixedVault vault;

    address mark = makeAddr("mark");
    address loner   = makeAddr("loner");
    address hen   = makeAddr("hen");

    function setUp() public {
        vault = new FixedVault();

        vm.deal(mark, 5 ether);
        vm.deal(loner,   3 ether);
        vm.deal(hen,   10 ether);

        vm.prank(mark);
        vault.deposit{value: 5 ether}();

        vm.prank(loner);
        vault.deposit{value: 3 ether}();
    }

    // ── Attack is blocked ────────────────────────────────────────────────────

    // Reentrancy attempt must revert.
    function test_reentrant_attack_reverts() public {
        ReentrantAttacker attacker = new ReentrantAttacker(address(vault));

        vm.prank(hen);
        // The re-entry inside receive() will hit the nonReentrant guard and revert,
        // which bubbles up and causes the whole attack() call to revert.
        vm.expectRevert();
        attacker.attack{value: 1 ether}(1 ether);
    }

    /// Vault balance must be untouched after a failed attack.
    function test_vault_balance_unchanged_after_failed_attack() public {
        ReentrantAttacker attacker = new ReentrantAttacker(address(vault));
        uint256 before = address(vault).balance;

        vm.prank(hen);
        try attacker.attack{value: 1 ether}(1 ether) {} catch {}

        assertEq(address(vault).balance, before);
    }

    // ── Legit users can still withdraw ──────────────────────────────────────

    //Alice can withdraw her full balance.
    function test_alice_can_withdraw_full() public {
        uint256 markBefore = mark.balance;

        vm.prank(mark);
        vault.withdraw(5 ether);

        assertEq(mark.balance, markBefore + 5 ether);
        assertEq(vault.balances(mark), 0);
    }

    // Bob can do a partial withdraw then withdraw the rest.
    function test_bob_partial_then_full_withdraw() public {
        vm.prank(loner);
        vault.withdraw(1 ether);
        assertEq(vault.balances(loner), 2 ether);

        vm.prank(loner);
        vault.withdraw(2 ether);
        assertEq(vault.balances(loner), 0);
    }

    /// Withdraw more than balance must revert.
    function test_withdraw_exceeds_balance_reverts() public {
        vm.prank(mark);
        vm.expectRevert("Insufficient balance");
        vault.withdraw(6 ether);
    }

    /// Multiple users can deposit and withdraw independently.
    function test_independent_deposits_and_withdrawals() public {
        vm.deal(hen, 2 ether);
        vm.prank(hen);
        vault.deposit{value: 2 ether}();

        vm.prank(mark);
        vault.withdraw(5 ether);

        vm.prank(hen);
        vault.withdraw(2 ether);

        assertEq(vault.balances(mark), 0);
        assertEq(vault.balances(hen),   0);
        assertEq(vault.balances(loner),   3 ether); // bob untouched
    }
}
