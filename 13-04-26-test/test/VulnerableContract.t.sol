// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {VulnerableContract} from "../src/VulnerableContract.sol";
import {FixedContract} from "../src/FixedContract.sol";
import {Attacker} from "../src/Attacker.sol";

contract VulnerableContractTest is Test {
    VulnerableContract public vulnerable;
    FixedContract public fixedContract; 
    Attacker public attacker;

    function setUp() public {
        vulnerable = new VulnerableContract();
        fixedContract = new FixedContract();
        attacker = new Attacker(address(vulnerable));
    }

    function test_ExploitDrainsVulnerable() public {
        // 1. Give a random user 10 ETH and have them deposit it
        address user = address(0x123);
        vm.deal(user, 10 ether);
        vm.prank(user);
        vulnerable.deposit{value: 10 ether}();

        // 2. Give the Attacker contract 1 ETH to start the attack
        vm.deal(address(attacker), 1 ether);
        vm.prank(address(attacker));
        attacker.attack{value: 1 ether}();

        // 3. Check if the bank is now empty
        assertEq(address(vulnerable).balance, 0);
    }

    function test_LegitUserCanWithdrawFromFixed() public {
        address legitUser = address(0x456);
        
        // Give user money and deposit
        vm.deal(legitUser, 5 ether);
        vm.prank(legitUser);
        fixedContract.deposit{value: 5 ether}();

        // Withdraw money
        vm.prank(legitUser);
        fixedContract.withdraw(5 ether);

        // Check if balance is 0
        assertEq(address(fixedContract).balance, 0);
    }

    function test_AttackFailsOnFixed() public {
        // 1. Put money in the fixed bank
        address user = address(0x1);
        vm.deal(user, 10 ether);
        vm.prank(user);
        fixedContract.deposit{value: 10 ether}();

        // 2. Deploy a mini attacker for the fixed bank
        FixedAttacker fixedAttacker = new FixedAttacker(fixedContract);

        // 3. Give it 1 ETH and tell it to attack
        vm.deal(address(fixedAttacker), 1 ether);
        vm.prank(address(fixedAttacker));
        
        // 4. Tell Foundry we expect this to fail
        vm.expectRevert();
        fixedAttacker.attack{value: 1 ether}();

        // 5. Verify the bank still has its 10 ETH
        assertEq(address(fixedContract).balance, 10 ether);
    }

    receive() external payable {}
}

contract FixedAttacker {
    FixedContract public bank;
    constructor(FixedContract _bank) { bank = _bank; }
    
    function attack() external payable {
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }
    
    receive() external payable {
        if (address(bank).balance >= msg.value) {
            bank.withdraw(msg.value);
        }
    }
}