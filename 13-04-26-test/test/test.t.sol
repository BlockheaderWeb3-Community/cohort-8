// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {test} from "../src/test.sol";

contract testTest is Test {
    test public t;

    function setUp() public {
        test = new test();
    }

    function test_Deposit() public {
        test.deposit{value: 1 ether}();
        assertEq(test.balances(address(this)), 1 ether);
    }

    function test_Withdraw() public {
        test.deposit{value: 1 ether}();
        test.withdraw(0.5 ether);
        assertEq(test.balances(address(this)), 0.5 ether);
    }

}