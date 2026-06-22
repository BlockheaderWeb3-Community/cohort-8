// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Attack} from "../src/attack.sol";
contract AttackTest is Test {
    Attack public attack;

    function setUp() public {
        attack = new Attack(address(this)); 
           vm.deal(address(attack), 10 ether);
    }

    function test_Attack() public {
        attack.attack{value: 1 ether}();
        vm.startPrank(address(attack));
        assertEq(address(this).balance, 0);
        assertGt(address(attack).balance, 1 ether);
        vm.stopPrank();

    
    }

    fuction test_WithdrawFunds() public {
        attack.attack{value: 1 ether}();
        vm.startPrank(address(attack));
        attack.withdrawFunds();
        assertEq(address(this).balance, 1 ether);
        assertEq(address(attack).balance, 0);
        vm.stopPrank();
    }

}