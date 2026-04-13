// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

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

        vm.deal(address(this), 10 ether);
        counter.deposit{value: 10 ether}();

        attacker = new Attacker(address(counter));

        attacker.attack{value: 1 ether}();

        assertGt(attacker.getBalance(), 1 ether);
    }
   
}
