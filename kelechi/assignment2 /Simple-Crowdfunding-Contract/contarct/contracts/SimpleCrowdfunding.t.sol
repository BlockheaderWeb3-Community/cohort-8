// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {SimpleCrowdfunding} from "./SimpleCrowdfunding.sol";
import {Test} from "forge-std/Test.sol";

contract SimpleCrowdfundingTest is Test {
    SimpleCrowdfunding crowdfunding;
    address owner;
    address contributor1;
    address contributor2;
    uint256 goal = 10 ether;
    uint256 duration = 1 hours;

    function setUp() public {
        owner = address(this);
        contributor1 = address(0x1);
        contributor2 = address(0x2);

        // Ensure contributors have ETH
        vm.deal(contributor1, 100 ether);
        vm.deal(contributor2, 100 ether);

        crowdfunding = new SimpleCrowdfunding(goal, duration);
    }

    function test_Deployment() public {
        assertEq(crowdfunding.owner(), address(this));
        assertEq(crowdfunding.goal(), goal);
        // Deadline is approximate, but should be > timestamp
        assertGt(crowdfunding.deadline(), block.timestamp);
    }

    function test_Contribute() public {
        vm.prank(contributor1);
        crowdfunding.contribute{value: 1 ether}();

        assertEq(crowdfunding.raisedAmount(), 1 ether);
        assertEq(crowdfunding.contributions(contributor1), 1 ether);
    }

    function test_ContributeAfterDeadline() public {
        vm.warp(block.timestamp + duration + 1);

        vm.prank(contributor1);
        vm.expectRevert("Crowdfunding has ended");
        crowdfunding.contribute{value: 1 ether}();
    }

    function test_WithdrawGoalMet() public {
        vm.prank(contributor1);
        crowdfunding.contribute{value: goal}();

        uint256 preBalance = address(this).balance;
        crowdfunding.withdraw();
        uint256 postBalance = address(this).balance;

        assertEq(postBalance - preBalance, goal);
        assertTrue(crowdfunding.withdrawn());
    }

    function test_WithdrawGoalNotMet() public {
        vm.prank(contributor1);
        crowdfunding.contribute{value: 1 ether}();

        vm.expectRevert("Goal not met");
        crowdfunding.withdraw();
    }

    function test_WithdrawNotOwner() public {
        vm.prank(contributor1);
        crowdfunding.contribute{value: goal}();

        vm.prank(contributor1);
        vm.expectRevert("Only owner can withdraw");
        crowdfunding.withdraw();
    }

    function test_WithdrawDouble() public {
        vm.prank(contributor1);
        crowdfunding.contribute{value: goal}();

        crowdfunding.withdraw();

        vm.expectRevert("Funds already withdrawn");
        crowdfunding.withdraw();
    }

    function test_Refund() public {
        uint256 amount = 5 ether;
        vm.prank(contributor1);
        crowdfunding.contribute{value: amount}();

        vm.warp(block.timestamp + duration + 1);

        uint256 preBalance = contributor1.balance;

        vm.prank(contributor1);
        crowdfunding.claimRefund();

        uint256 postBalance = contributor1.balance;
        assertEq(postBalance - preBalance, amount);
        assertEq(crowdfunding.contributions(contributor1), 0);
    }

    function test_RefundGoalMet() public {
        vm.prank(contributor1);
        crowdfunding.contribute{value: goal}();

        vm.warp(block.timestamp + duration + 1);

        vm.prank(contributor1);
        vm.expectRevert("Goal was met");
        crowdfunding.claimRefund();
    }

    function test_RefundBeforeDeadline() public {
        vm.prank(contributor1);
        crowdfunding.contribute{value: 1 ether}();

        vm.prank(contributor1);
        vm.expectRevert("Crowdfunding not yet ended");
        crowdfunding.claimRefund();
    }

    function test_RefundDouble() public {
        uint256 amount = 5 ether;
        vm.prank(contributor1);
        crowdfunding.contribute{value: amount}();

        vm.warp(block.timestamp + duration + 1);

        vm.prank(contributor1);
        crowdfunding.claimRefund();

        vm.prank(contributor1);
        vm.expectRevert("No contribution to refund");
        crowdfunding.claimRefund();
    }
}
