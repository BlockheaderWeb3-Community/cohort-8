// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {CounterV3} from "../src/CounterV3.sol";

contract CounterV3Test is Test {
    CounterV3 public counterv3;
    address public addr1;
    address public addr2;

    function setUp() public {
        counterv3 = new CounterV3();
        addr1 = makeAddr("addr1");
        addr2 = makeAddr("addr2");
    }

    function test_setNumber() public {
        counterv3.setNumber(3);
        assertEq(counterv3.number(), 3);
    }

    function test_increment() public {
        counterv3.increment();
        assertEq(counterv3.number(), 1);
    }

    function test_revert_increment_withoutPrivilege() public {
        vm.prank(addr1);
        vm.expectRevert("Owner consent required");
        counterv3.increment();

        assertEq(counterv3.number(), 0);
    }

    function test_revert_setNumber_withoutPrivilege() public {
        vm.prank(addr1);
        vm.expectRevert("Owner consent required");
        counterv3.setNumber(7);

        assertEq(counterv3.number(), 0);
    }

    function test_grantPrivilege() public {
        vm.prank(addr1);
        counterv3.requestPrivilege();

        assertTrue(counterv3.pendingApproval(addr1));

        counterv3.grantPrivilege(addr1);

        assertTrue(counterv3.approvedCallers(addr1));
        assertFalse(counterv3.pendingApproval(addr1));
    }

    function test_approvedCaller_increment() public {
        vm.prank(addr1);
        counterv3.requestPrivilege();

        counterv3.grantPrivilege(addr1);

        vm.prank(addr1);
        counterv3.increment();

        assertEq(counterv3.number(), 1);
    }

    function test_revert_grantPrivilege_withoutRequest() public {
        vm.expectRevert("No pending request");
        counterv3.grantPrivilege(addr1);
    }

    function test_revokePrivilege() public {
        vm.prank(addr1);
        counterv3.requestPrivilege();

        counterv3.grantPrivilege(addr1);
        counterv3.revokePrivilege(addr1);

        assertFalse(counterv3.approvedCallers(addr1));
    }

    function test_revert_revokedCaller_setNumber() public {
        vm.prank(addr1);
        counterv3.requestPrivilege();

        counterv3.grantPrivilege(addr1);
        counterv3.revokePrivilege(addr1);

        vm.prank(addr1);
        vm.expectRevert("Owner consent required");
        counterv3.setNumber(7);
    }

    function test_revert_grantPrivilege_notOwner() public {
        vm.prank(addr1);
        counterv3.requestPrivilege();

        vm.prank(addr2);
        vm.expectRevert("Not owner");
        counterv3.grantPrivilege(addr1);
    }

    function test_revert_revokePrivilege_notOwner() public {
        vm.prank(addr1);
        counterv3.requestPrivilege();

        counterv3.grantPrivilege(addr1);

        vm.prank(addr2);
        vm.expectRevert("Not owner");
        counterv3.revokePrivilege(addr1);
    }

    function test_revert_revokePrivilege_withoutApproval() public {
        vm.expectRevert("Caller not approved");
        counterv3.revokePrivilege(addr1);
    }

    function test_revert_requestPrivilege_owner() public {
        vm.expectRevert("Owner does not need consent");
        counterv3.requestPrivilege();
    }
}
