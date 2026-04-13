// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import 'forge-std/Test.sol';
import '../src/Counterv3.sol';

contract CounterV3Test is Test {
  CounterV3 counter;

  address owner = address(this);
  address alice = address(1);
  address bob = address(2);

  event Increment(uint by);
  event Decrement(uint by);

  function setUp() public {
    counter = new CounterV3();
  }

  function testOwnerIsSetCorrectly() public {
    assertEq(counter.owner(), owner);
  }

  function testOwnerCanGrantAccess() public {
    counter.grantAccess(alice);
    assertTrue(counter.authorized(alice));
  }

  function testNonOwnerCannotGrantAccess() public {
    vm.prank(alice);
    vm.expectRevert('Not the owner');
    counter.grantAccess(bob);
  }

  function testOwnerCanRevokeAccess() public {
    counter.grantAccess(alice);
    counter.revokeAccess(alice);
    assertFalse(counter.authorized(alice));
  }

  function testNonOwnerCannotRevokeAccess() public {
    vm.prank(alice);
    vm.expectRevert('Not the owner');
    counter.revokeAccess(bob);
  }

  function testAuthorizedCanIncrement() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    vm.expectEmit(true, false, false, true);
    emit Increment(1);

    counter.inc();

    assertEq(counter.x(), 1);
  }

  function testUnauthorizedCannotIncrement() public {
    vm.prank(alice);
    vm.expectRevert('Not authorized');
    counter.inc();
  }

  function testIncByRevertsIfZero() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    vm.expectRevert('incBy: increment should be positive');
    counter.incBy(0);
  }

  function testDecRevertsIfZero() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    vm.expectRevert('Counter cannot go below 0.');
    counter.dec();
  }

  function testDecByRevertsIfZeroAmount() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    vm.expectRevert('Amount must be greater than 0.');
    counter.decBy(0);
  }

  function testDecByRevertsIfUnderflow() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    counter.incBy(3);

    vm.prank(alice);
    vm.expectRevert('Counter cannot go below 0.');
    counter.decBy(5);
  }

  function testOwnerIsAuthorizedByDefault() public {
    counter.inc();
    assertEq(counter.x(), 1);
  }

  function testRevokeAccessPreventsUsage() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    counter.inc();

    counter.revokeAccess(alice);

    vm.prank(alice);
    vm.expectRevert('Not authorized');
    counter.inc();
  }

  function testIncByWorks() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    vm.expectEmit(true, false, false, true);
    emit Increment(5);

    counter.incBy(5);

    assertEq(counter.x(), 5);
  }

  function testDecWorks() public {
    counter.grantAccess(alice);

    vm.prank(alice);
    counter.inc();

    vm.prank(alice);
    vm.expectEmit(true, false, false, true);
    emit Decrement(1);

    counter.dec();

    assertEq(counter.x(), 0);
  }

  function testDecByWorks() public {
    counter.grantAccess(alice);

    vm.startPrank(alice);
    counter.incBy(10);

    vm.expectEmit(true, false, false, true);
    emit Decrement(5);
    counter.decBy(5);
    vm.stopPrank();

    assertEq(counter.x(), 5);
  }
}
