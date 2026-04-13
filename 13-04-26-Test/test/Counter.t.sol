// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console} from "forge-std/console.sol";
import {Test} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";
import {Attacker} from "../src/Attacker.sol";

contract CounterTest is Test {
    Counter  counter;
    Attacker attacker;

    function setUp() public {
        counter = new Counter();
    }

   function testReentrancy() public {

        
        counter.deposit{value: 10 ether}();

        attacker = new Attacker(address(counter));

        attacker.attack{value: 1 ether}();

        // console.log("ContractBal",address(counter).balance);
        assertEq(address(counter).balance, 0); 

        // console.log("AttackBal",address(attacker).balance);
        assertEq(address(attacker).balance, 11 ether);


   }
    
}
