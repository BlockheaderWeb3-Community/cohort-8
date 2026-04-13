// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import "forge-std/Test.sol";
import "../src/vulnerable.sol";
import "../src/attacker.sol";

contract AttackerTest is Test {
    VulnerableVault vault;
    Attacker attacker;

    address mark  = makeAddr("mark");
    address loner = makeAddr("loner");
    address hen   = makeAddr("hen");

    uint256 constant CHUNK = 1 ether;

    function setUp() public {
        vault = new VulnerableVault();

        vm.deal(mark,  5 ether);
        vm.deal(loner, 3 ether);

        vm.prank(mark);
        vault.deposit{value: 5 ether}();

        vm.prank(loner);
        vault.deposit{value: 3 ether}();

        vm.deal(hen, 10 ether);

        // Deploy attacker as hen so hen is the owner
        vm.prank(hen);
        attacker = new Attacker(address(vault));
    }

    function test_attack_drains_vault() public {
        uint256 vaultStart = address(vault).balance;
        assertEq(vaultStart, 8 ether);

        vm.prank(hen);
        attacker.attack{value: CHUNK}(CHUNK);

        uint256 vaultEnd = address(vault).balance;

        assertEq(vaultEnd, 0);
        // attacker holds 1 ETH (own deposit) + 8 ETH (victims) = 9 ETH
        assertEq(address(attacker).balance, 9 ether);

        console.log("vault before:", vaultStart);
        console.log("vault after: ", vaultEnd);
        console.log("attacker bal:", address(attacker).balance);
    }

    function test_attacker_profits() public {
        uint256 henBefore = hen.balance;

        vm.prank(hen);
        attacker.attack{value: CHUNK}(CHUNK);

        vm.prank(hen);
        attacker.drain();

        // hen spent 1 ETH, got back 9 ETH → net profit of 8 ETH
        assertGt(hen.balance, henBefore);
        assertEq(hen.balance - henBefore, 8 ether);
    }

    function test_vault_recorded_balances_exceed_actual_balance() public {
        vm.prank(hen);
        attacker.attack{value: CHUNK}(CHUNK);

        // mark and loner's recorded balances are untouched, but vault is empty
        uint256 recordedTotal = vault.balances(mark) + vault.balances(loner);
        assertGt(recordedTotal, address(vault).balance);
    }
}
