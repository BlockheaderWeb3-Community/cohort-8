// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {CounterV3} from "../src/CounterV3.sol";
import {Test} from "forge-std/Test.sol";

contract CounterV3Test is Test {
    CounterV3 counter;
    address owner;
    address privilegedUser;
    address nonPrivilegedUser;
    
    // Events to test
    event Increment(uint by);
    event Decrement(uint by);
    event PrivilegeGranted(address indexed account);
    event PrivilegeRevoked(address indexed account);
    
    function setUp() public {
        owner = address(this);
        privilegedUser = address(0x123);
        nonPrivilegedUser = address(0x456);
        
        counter = new CounterV3();
    }
    
    // Test 1: Deployment and initial state
    function test_InitialState() public view {
        assertEq(counter.x(), 0, "Initial counter value should be 0");
        assertEq(counter.owner(), owner, "Deployer should be owner");
        assertFalse(counter.privileged(privilegedUser), "New address should not be privileged");
        assertFalse(counter.privileged(nonPrivilegedUser), "Non-privileged user should not be privileged");
    }
    
    // Test 2: Owner can increment
    function test_OwnerCanIncrement() public {
        // Check state BEFORE
        uint256 counterBefore = counter.x();
        assertEq(counterBefore, 0, "Counter should start at 0");
        
        // Perform action
        counter.inc();
        
        // Check state AFTER
        uint256 counterAfter = counter.x();
        assertEq(counterAfter, 1, "Counter should increment to 1");
        assertEq(counterAfter - counterBefore, 1, "Counter should increase by 1");
    }
    
    // Test 3: Non-owner cannot increment without privilege
    function test_NonOwnerCannotIncrementWithoutPrivilege() public {
        vm.prank(nonPrivilegedUser);
        vm.expectRevert("CounterV3: caller is not owner or privileged");
        counter.inc();
    }
    
    // Test 4: Owner can grant privilege
    function test_OwnerCanGrantPrivilege() public {
        // Check state BEFORE
        bool privilegedBefore = counter.privileged(privilegedUser);
        assertFalse(privilegedBefore, "User should not be privileged initially");
        
        // Perform action
        counter.grantPrivilege(privilegedUser);
        
        // Check state AFTER
        bool privilegedAfter = counter.privileged(privilegedUser);
        assertTrue(privilegedAfter, "User should be privileged after grant");
    }
    
    // Test 5: Non-owner cannot grant privilege
    function test_NonOwnerCannotGrantPrivilege() public {
        vm.prank(nonPrivilegedUser);
        vm.expectRevert("CounterV3: caller is not the owner");
        counter.grantPrivilege(privilegedUser);
    }
    
    // Test 6: Cannot grant privilege to zero address
    function test_CannotGrantPrivilegeToZeroAddress() public {
        vm.expectRevert("CounterV3: invalid address");
        counter.grantPrivilege(address(0));
    }
    
    // Test 7: Cannot grant privilege to owner
    function test_CannotGrantPrivilegeToOwner() public {
        vm.expectRevert("CounterV3: owner is already privileged");
        counter.grantPrivilege(owner);
    }
    
    // Test 8: Privileged user can increment
    function test_PrivilegedUserCanIncrement() public {
        // Setup: Grant privilege
        counter.grantPrivilege(privilegedUser);
        
        // Check state BEFORE
        uint256 counterBefore = counter.x();
        assertEq(counterBefore, 0, "Counter should start at 0");
        
        // Perform action
        vm.prank(privilegedUser);
        counter.inc();
        
        // Check state AFTER
        uint256 counterAfter = counter.x();
        assertEq(counterAfter, 1, "Privileged user should be able to increment");
        assertEq(counterAfter - counterBefore, 1, "Counter should increase by 1");
    }
    
    // Test 9: Owner can revoke privilege
    function test_OwnerCanRevokePrivilege() public {
        // Setup: Grant privilege first
        counter.grantPrivilege(privilegedUser);
        
        // Check state BEFORE revoke
        bool privilegedBefore = counter.privileged(privilegedUser);
        assertTrue(privilegedBefore, "User should be privileged before revoke");
        
        // Perform action
        counter.revokePrivilege(privilegedUser);
        
        // Check state AFTER revoke
        bool privilegedAfter = counter.privileged(privilegedUser);
        assertFalse(privilegedAfter, "User should not be privileged after revoke");
    }
    
    // Test 10: Non-owner cannot revoke privilege
    function test_NonOwnerCannotRevokePrivilege() public {
        counter.grantPrivilege(privilegedUser);
        
        vm.prank(nonPrivilegedUser);
        vm.expectRevert("CounterV3: caller is not the owner");
        counter.revokePrivilege(privilegedUser);
    }
    
    // Test 11: Cannot revoke privilege from non-privileged account
    function test_CannotRevokePrivilegeFromNonPrivileged() public {
        vm.expectRevert("CounterV3: account is not privileged");
        counter.revokePrivilege(privilegedUser);
    }
    
    // Test 12: Revoked user cannot increment
    function test_RevokedUserCannotIncrement() public {
        counter.grantPrivilege(privilegedUser);
        counter.revokePrivilege(privilegedUser);
        
        vm.prank(privilegedUser);
        vm.expectRevert("CounterV3: caller is not owner or privileged");
        counter.inc();
    }
    
    // Test 13: incBy function works for owner
    function test_OwnerCanIncrementBy() public {
        // Check state BEFORE
        uint256 counterBefore = counter.x();
        assertEq(counterBefore, 0, "Counter should start at 0");
        
        // Perform action
        counter.incBy(5);
        
        // Check state AFTER
        uint256 counterAfter = counter.x();
        assertEq(counterAfter, 5, "Counter should increment by 5");
        assertEq(counterAfter - counterBefore, 5, "Counter should increase by exactly 5");
    }
    
    // Test 14: incBy function works for privileged user
    function test_PrivilegedUserCanIncrementBy() public {
        // Setup: Grant privilege
        counter.grantPrivilege(privilegedUser);
        
        // Check state BEFORE
        uint256 counterBefore = counter.x();
        assertEq(counterBefore, 0, "Counter should start at 0");
        
        // Perform action
        vm.prank(privilegedUser);
        counter.incBy(10);
        
        // Check state AFTER
        uint256 counterAfter = counter.x();
        assertEq(counterAfter, 10, "Privileged user should increment by 10");
        assertEq(counterAfter - counterBefore, 10, "Counter should increase by exactly 10");
    }
    
    // Test 15: incBy requires positive value
    function test_incByRequiresPositiveValue() public {
        vm.expectRevert("incBy: increment should be positive");
        counter.incBy(0);
    }
    
    // Test 16: decrease function works for owner
    function test_OwnerCanDecrease() public {
        // Setup: Increment first
        counter.incBy(10);
        
        // Check state BEFORE decrease
        uint256 counterBefore = counter.x();
        assertEq(counterBefore, 10, "Counter should be at 10");
        
        // Perform action
        counter.decrease(3);
        
        // Check state AFTER decrease
        uint256 counterAfter = counter.x();
        assertEq(counterAfter, 7, "Counter should decrease to 7");
        assertEq(counterBefore - counterAfter, 3, "Counter should decrease by exactly 3");
    }
    
    // Test 17: decrease function works for privileged user
    function test_PrivilegedUserCanDecrease() public {
        // Setup: Increment and grant privilege
        counter.incBy(15);
        counter.grantPrivilege(privilegedUser);
        
        // Check state BEFORE decrease
        uint256 counterBefore = counter.x();
        assertEq(counterBefore, 15, "Counter should be at 15");
        
        // Perform action
        vm.prank(privilegedUser);
        counter.decrease(5);
        
        // Check state AFTER decrease
        uint256 counterAfter = counter.x();
        assertEq(counterAfter, 10, "Privileged user should decrease by 5");
        assertEq(counterBefore - counterAfter, 5, "Counter should decrease by exactly 5");
    }
    
    // Test 18: decrease requires positive value
    function test_decreaseRequiresPositiveValue() public {
        vm.expectRevert("decrease: decrement should be positive");
        counter.decrease(0);
    }
    
    // Test 19: decrease cannot go below zero
    function test_decreaseCannotGoBelowZero() public {
        counter.incBy(5);
        
        vm.expectRevert("decrease: counter cannot go below zero");
        counter.decrease(10);
    }
    
    // Test 20: Multiple privileged users
    function test_MultiplePrivilegedUsers() public {
        address privilegedUser2 = address(0x789);
        
        // Check state BEFORE
        uint256 counterBefore = counter.x();
        assertEq(counterBefore, 0, "Counter should start at 0");
        
        // Setup: Grant privileges
        counter.grantPrivilege(privilegedUser);
        counter.grantPrivilege(privilegedUser2);
        
        // Perform actions
        vm.prank(privilegedUser);
        counter.inc();
        
        vm.prank(privilegedUser2);
        counter.incBy(3);
        
        // Check state AFTER
        uint256 counterAfter = counter.x();
        assertEq(counterAfter, 4, "Multiple privileged users should work");
        assertEq(counterAfter - counterBefore, 4, "Counter should increase by 4 total");
    }
    
    // 🎯 ADDITIONAL TESTS FOR EVENTS AND COMPLETE COVERAGE
    
    // Test 21: inc() emits Increment event
    function test_IncEmitsEvent() public {
        // Expect event
        vm.expectEmit(true, true, true, true);
        emit Increment(1);
        
        // Perform action
        counter.inc();
    }
    
    // Test 22: incBy() emits Increment event
    function test_IncByEmitsEvent() public {
        // Expect event
        vm.expectEmit(true, true, true, true);
        emit Increment(5);
        
        // Perform action
        counter.incBy(5);
    }
    
    // Test 23: decrease() emits Decrement event
    function test_DecreaseEmitsEvent() public {
        // Setup
        counter.incBy(10);
        
        // Expect event
        vm.expectEmit(true, true, true, true);
        emit Decrement(3);
        
        // Perform action
        counter.decrease(3);
    }
    
    // Test 24: grantPrivilege() emits PrivilegeGranted event
    function test_GrantPrivilegeEmitsEvent() public {
        // Expect event
        vm.expectEmit(true, false, false, true);
        emit PrivilegeGranted(privilegedUser);
        
        // Perform action
        counter.grantPrivilege(privilegedUser);
    }
    
    // Test 25: revokePrivilege() emits PrivilegeRevoked event
    function test_RevokePrivilegeEmitsEvent() public {
        // Setup
        counter.grantPrivilege(privilegedUser);
        
        // Expect event
        vm.expectEmit(true, false, false, true);
        emit PrivilegeRevoked(privilegedUser);
        
        // Perform action
        counter.revokePrivilege(privilegedUser);
    }
    
    // Test 26: Non-privileged user cannot use incBy
    function test_NonPrivilegedUserCannotIncBy() public {
        vm.prank(nonPrivilegedUser);
        vm.expectRevert("CounterV3: caller is not owner or privileged");
        counter.incBy(5);
    }
    
    // Test 27: Non-privileged user cannot use decrease
    function test_NonPrivilegedUserCannotDecrease() public {
        counter.incBy(10);
        
        vm.prank(nonPrivilegedUser);
        vm.expectRevert("CounterV3: caller is not owner or privileged");
        counter.decrease(5);
    }
    
    // Test 28: Counter state persists across multiple operations
    function test_CounterStatePersistence() public {
        // Check initial state
        assertEq(counter.x(), 0, "Should start at 0");
        
        // Multiple operations
        counter.inc();
        assertEq(counter.x(), 1, "Should be 1 after inc");
        
        counter.incBy(5);
        assertEq(counter.x(), 6, "Should be 6 after incBy(5)");
        
        counter.decrease(2);
        assertEq(counter.x(), 4, "Should be 4 after decrease(2)");
        
        counter.inc();
        assertEq(counter.x(), 5, "Should be 5 after final inc");
    }
    
    // Test 29: Privilege state persists correctly
    function test_PrivilegeStatePersistence() public {
        // Initially not privileged
        assertFalse(counter.privileged(privilegedUser), "Should not be privileged initially");
        
        // Grant privilege
        counter.grantPrivilege(privilegedUser);
        assertTrue(counter.privileged(privilegedUser), "Should be privileged after grant");
        
        // Privilege persists
        vm.prank(privilegedUser);
        counter.inc();
        assertTrue(counter.privileged(privilegedUser), "Should still be privileged after using it");
        
        // Revoke privilege
        counter.revokePrivilege(privilegedUser);
        assertFalse(counter.privileged(privilegedUser), "Should not be privileged after revoke");
    }
    
    // Test 30: Owner remains owner throughout
    function test_OwnershipPersistence() public view {
        assertEq(counter.owner(), owner, "Owner should be set correctly");
        // Owner never changes in this contract (no transfer function)
    }
}