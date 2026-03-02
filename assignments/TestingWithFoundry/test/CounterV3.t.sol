// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {CounterV3} from "../src/CounterV3.sol";

contract CounterV3Test is Test {
    CounterV3 public counter;
    address owner = address(this);
    address user1 = address(0x1);
    address user2 = address(0x2);

    event Increment(uint by);
    event Decrement(uint by);
    event PrivilegeGranted(address user);

    function setUp() public {
        counter = new CounterV3();
    }

    function test_InitialState() public view {
        assertEq(counter.x(), 0);
        assertEq(counter.owner(), owner);
        assertFalse(counter.privileged(user1));
    }

    function test_Inc() public {
        vm.expectEmit(true, true, true, true);
        emit Increment(1);
        counter.inc();
        assertEq(counter.x(), 1);
    }

    function test_IncMultiple() public {
        counter.inc();
        counter.inc();
        assertEq(counter.x(), 2);
    }

    function test_IncBy() public {
        vm.expectEmit(true, true, true, true);
        emit Increment(5);
        counter.incBy(5);
        assertEq(counter.x(), 5);
    }

    function test_IncByZeroReverts() public {
        vm.expectRevert("incBy: increment should be positive");
        counter.incBy(0);
    }

    function test_Decrease() public {
        counter.incBy(10);
        vm.expectEmit(true, true, true, true);
        emit Decrement(3);
        counter.decrease(3);
        assertEq(counter.x(), 7);
    }

    function test_DecreaseToZero() public {
        counter.incBy(5);
        counter.decrease(5);
        assertEq(counter.x(), 0);
    }

    function test_DecreaseUnderflowReverts() public {
        counter.incBy(5);
        vm.expectRevert("Cannot decrease below zero");
        counter.decrease(6);
    }

    function test_DecreaseFromZeroReverts() public {
        vm.expectRevert("Cannot decrease below zero");
        counter.decrease(1);
    }

    function test_GrantPrivilege() public {
        vm.expectEmit(true, true, true, true);
        emit PrivilegeGranted(user1);
        counter.grantPrivilege(user1);
        assertTrue(counter.privileged(user1));
    }

    function test_GrantPrivilegeNonOwnerReverts() public {
        vm.prank(user1);
        vm.expectRevert("Not owner");
        counter.grantPrivilege(user2);
    }

    function test_PrivilegedUserCanInc() public {
        counter.grantPrivilege(user1);
        vm.prank(user1);
        counter.inc();
        assertEq(counter.x(), 1);
    }

    function test_PrivilegedUserCanIncBy() public {
        counter.grantPrivilege(user1);
        vm.prank(user1);
        counter.incBy(10);
        assertEq(counter.x(), 10);
    }

    function test_PrivilegedUserCanDecrease() public {
        counter.incBy(10);
        counter.grantPrivilege(user1);
        vm.prank(user1);
        counter.decrease(5);
        assertEq(counter.x(), 5);
    }

    function test_UnauthorizedIncReverts() public {
        vm.prank(user1);
        vm.expectRevert("Not authorized");
        counter.inc();
    }

    function test_UnauthorizedIncByReverts() public {
        vm.prank(user1);
        vm.expectRevert("Not authorized");
        counter.incBy(5);
    }

    function test_UnauthorizedDecreaseReverts() public {
        vm.prank(user1);
        vm.expectRevert("Not authorized");
        counter.decrease(1);
    }

    function testFuzz_IncBy(uint by) public {
        vm.assume(by > 0 && by < type(uint).max);
        counter.incBy(by);
        assertEq(counter.x(), by);
    }

    function testFuzz_Decrease(uint initial, uint decrease) public {
        vm.assume(initial > 0 && initial < type(uint).max);
        vm.assume(decrease <= initial);
        counter.incBy(initial);
        counter.decrease(decrease);
        assertEq(counter.x(), initial - decrease);
    }
}
