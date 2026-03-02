// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "../lib/forge-std/src/Test.sol";
import {CounterV3} from "../src/CounterV3.sol";
import {console} from "../lib/forge-std/src/console.sol";

contract CounterV3Test is Test {
  CounterV3 public counterV3;

  uint public x;

  address public owner;
  address public addr1;
  address public addr2;

  // === Setup function upon to deploy the contract
  function setUp() public {
    counterV3 = new CounterV3();

    x = counterV3.x();

    owner = counterV3.owner();
    addr1 = makeAddr("addr1");
    addr2 = makeAddr("addr2");

    console.log("    ");

    // console.log("The value of x is: ", x);
    // console.log("The contract owner is: ", owner);
    // console.log("addr1 is: ", addr1);
    // console.log("addr2 is: ", addr2);
  }

  // === Default Values
  function testDefaultValues() public view {
    console.log("Test 1: testDefaultValues");
    console.log("   ");

    assertEq(counterV3.owner(), owner);
    console.log("The real contract owner is: ", owner);

    assertEq(counterV3.x(), 0);
    console.log("The value of x in testDefaultValues is: ", x);
  }

  // === Increments
  function testOwnerCanIncrement() public {
    console.log("Test 2: testOwnerCanIncrement");
    console.log("   ");

    counterV3.inc();
    console.log("The value of x in testOwnerCanIncrement is: ", counterV3.x());
    assertEq(counterV3.x(), 1);
  }

  function testAuthorizedAddrCanIncrement() public {
    console.log("Test 3: testAuthorizedAddrCanIncrement");
    console.log("   ");

    counterV3.grantAccess(addr1);

    vm.prank(addr1);
    counterV3.inc();
    console.log("The value of x in testAuthorizedAddrCanIncrement is: ", counterV3.x());

    assertEq(counterV3.x(), 1);
  }

  function testUnauthorizedUserCannotIncrement() public {
    console.log("Test 4: testUnauthorizedUserCannotIncrement");
    console.log("   ");

    vm.prank(addr1);
    vm.expectRevert("Not authorized");
    counterV3.inc();
    console.log("The value of x in testUnauthorizedAddrCanIncrement is: ", counterV3.x());
  }

  function testIncBy() public {
    console.log("Test 5: testIncBy");
    console.log("   ");

    counterV3.incBy(5);
    console.log("The value of x in testIncBy is: ", counterV3.x());
    assertEq(counterV3.x(), 5);
  }

  function testIncByRevertsIfZero() public {
    console.log("Test 6: testIncByRevertsIfZero");
    console.log("   ");

    vm.expectRevert("incBy: increment should be positive");
    counterV3.incBy(0);
    console.log("The value of x in testIncByRevertsIfZero is: ", counterV3.x());
  }

  // === Decrements
  function testOwnerCanDecrement() public {
    console.log("Test 7: testOwnerCanDecrement");
    console.log("   ");

    counterV3.incBy(6);
    console.log("The value of x in testOwnerCanDecrement is: ", counterV3.x());

    counterV3.dec();
    console.log("The value of x in testOwnerCanDecrement is: ", counterV3.x());

    assertEq(counterV3.x(), 5);
  }

  function testsDecRevertsIfCounterIsZero() public {
    console.log("Test 8: testsDecRevertsIfCounterIsZero");
    console.log("   ");

    vm.expectRevert("Counter cannot go below 0.");
    counterV3.dec();
    console.log("The value of x in testsDecRevertsIfCounterIsZero is: ", counterV3.x());
  }

  function testDecByRevertsIfAmountIsZero() public {
    console.log("Test 10: testDecByRevertsIfAmountIsZero");
    console.log("   ");

    vm.expectRevert("Amount must be greater than 0.");
    counterV3.decBy(0);
    console.log("The value of x in ttestDecByRevertsIfAmountIsZero is: ", counterV3.x());
  }

  function testDecBy() public {
    console.log("Test 10: testDecBy");
    console.log("   ");

    counterV3.incBy(10);
    console.log("The value of x in testsDecBy is: ", counterV3.x());
    counterV3.decBy(4);
    console.log("The value of x in testsDecBy is: ", counterV3.x());

    assertEq(counterV3.x(), 6);
  }

  function testDecByRevertsIfUnderflow() public {
    console.log("Test 11: testDecByRevertsIfUnderflow");
    console.log("   ");

    counterV3.incBy(3);
    console.log("The value of x in testDecByRevertsIfUnderflow is: ", counterV3.x());
    counterV3.decBy(4);
    console.log("The value of x in testDecByRevertsIfUnderflow is: ", counterV3.x());
  }

  // === Modifiers and Control
  function testOwnerCanGrantAccess() public {
    console.log("Test 12: testOwnerCanGrantAccess");
    console.log("   ");

    counterV3.grantAccess(addr1);
    console.log("Does addr1 have access: ", counterV3.authorized(addr1));
    assertTrue(counterV3.authorized(addr1));
  }

  function testOwnerCanRevokeAccess() public {
    console.log("Test 12: testOwnerCanRevokeAccess");
    console.log("   ");

    counterV3.grantAccess(addr1);
    counterV3.revokeAccess(addr1);
    console.log("Does addr1 have access: ", counterV3.authorized(addr1));

    assertFalse(counterV3.authorized(addr1));
  }

  function testOnlyOwnerCanGrantAccess() public {
    console.log("Test 13: testOnlyOwnerCanGrantAccess");
    console.log("   ");

    vm.prank(addr1);
    vm.expectRevert("Not the owner");
    counterV3.grantAccess(addr2);
    console.log("Does addr2 have access: ", counterV3.authorized(addr2));
  }

  function testRevokedUserCannotIncrement() public {
    console.log("Test 14: testOwnerCanGrantAccess");
    console.log("   ");

    counterV3.grantAccess(addr1);

    vm.prank(addr1);
    console.log("The value of x before inc() in testRevokedUserCannotIncrement is: ", counterV3.x());
    counterV3.inc();
    console.log("The value of x after inc() in testRevokedUserCannotIncrement is: ", counterV3.x());

    counterV3.revokeAccess(addr1);

    vm.prank(addr1);
    vm.expectRevert("Not authorized");
    counterV3.inc();
    console.log("The value of x after inc() in testRevokedUserCannotIncrement is: ", counterV3.x());
  }

  // === Events
  function testIncrementEmitsEvent() public {
    console.log("Test 15: testIncrementEmitsEvent");
    console.log("   ");

    vm.expectEmit(true, false, false, true);
    emit CounterV3.Increment(1);

    counterV3.inc();
    console.log("The value of x in testIncrementEmitsEvent is: ", counterV3.x());
  }

  function testDecrementEmitsEvent() public {
    console.log("Test 16: testDecrementEmitsEvent");
    console.log("   ");

    counterV3.inc();
    console.log("The value of x after inc() in testDecrementEmitsEvent is: ", counterV3.x());

    vm.expectEmit(true, false, false, true);
    emit CounterV3.Decrement(1);

    counterV3.dec();
    console.log("The value of x after dec() in testDecrementEmitsEvent is: ", counterV3.x());
  }
}
