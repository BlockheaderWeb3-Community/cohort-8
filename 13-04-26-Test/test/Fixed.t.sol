// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console} from "forge-std/console.sol";
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


        assertEq(address(counterfixed).balance, 0); 
        assertEq(address(attacker).balance, 0); 

        

        attacker = new Attacker(address(counterfixed));
        
        
        attacker.attack{value: 1 ether}();
       
        assertEq(address(attacker).balance, 1 ether); 
        
        uint256 attackerBalance = attacker.getBalance();

        // console.log("AttackBal",address(attacker).balance);

        // console.log("ContractBal",address(counterfixed).balance);

        assertEq(attackerBalance, 1 ether, "Attacker has what he deposited");
    }
   
}
