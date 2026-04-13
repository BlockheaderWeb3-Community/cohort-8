// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Counterfixed} from "../src/Fixed.sol";
import {Attacker} from "../src/Attacker.sol";

contract CounterfixTest is Test {
    Counterfixed counterfixed;
    Attacker attacker;
    

    function setUp() public {
        counterfixed = new Counterfixed();
    }

   function testNoReentrancy() public {

        attacker = new Attacker(address(counterfixed));
        
        vm.deal(address(attacker), 1 ether);
        attacker.attack{value: 1 ether}();
        
        uint256 attackerBalance = attacker.getBalance();
        
        assertEq(attackerBalance, 1 ether, "Attacker has what he deposited");
    }
   
}
