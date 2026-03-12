// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/Escrow.sol";

/// @notice Minimal contract that can receive ETH
contract Receiver {
    receive() external payable {}
}

contract EscrowTest is Test {
    Escrow escrow;

    address buyer;
    Receiver seller; // Use a contract so it can receive ETH
    address escrowAgent; // This test contract acts as the agent

    uint256 escrowFee = 100; // 1%
    uint256 disputeTimeout = 1 days;
    receive() external payable {}

    function setUp() public {
        // Create buyer EOA
        buyer = vm.addr(1);
        vm.deal(buyer, 10 ether);

        // Deploy seller as Receiver contract
        seller = new Receiver();

        // Escrow agent is this test contract
        escrowAgent = address(this);

        // Deploy Escrow contract with proper addresses
        escrow = new Escrow(buyer, address(seller), escrowFee, disputeTimeout);
    }

    /// @notice Test buyer deposit
    function testDeposit() public {
        vm.prank(buyer);
        escrow.deposit{value: 5 ether}();

        assertEq(escrow.escrowAmount(), 5 ether);
        assertEq(uint256(escrow.escrowState()), uint256(Escrow.EscrowState.AWAITING_DELIVERY));
    }

    /// @notice Test that only buyer can deposit
    function testDepositUnauthorized() public {
        vm.expectRevert(Escrow.Unauthorized.selector);
        escrow.deposit{value: 1 ether}(); // caller is this contract, not buyer
    }

    /// @notice Test delivery confirmation
    function testConfirmDelivery() public {
        vm.prank(buyer);
        escrow.deposit{value: 5 ether}();

        vm.prank(address(seller));
        escrow.confirmDelivery();

        assertTrue(escrow.deliveryConfirmed());
    }

    /// @notice Test that only seller can confirm delivery
    function testConfirmDeliveryUnauthorized() public {
        vm.prank(buyer);
        escrow.deposit{value: 5 ether}();

        vm.expectRevert(Escrow.Unauthorized.selector);
        escrow.confirmDelivery(); // caller is test contract
    }

    /// @notice Test release funds to seller
    function testReleaseFunds() public {
        vm.prank(buyer);
        escrow.deposit{value: 10 ether}();

        vm.prank(address(seller));
        escrow.confirmDelivery();

        uint256 sellerBalanceBefore = address(seller).balance;
        uint256 agentBalanceBefore = address(this).balance;

        uint256 fee = (10 ether * escrowFee) / 10000;
        uint256 sellerAmount = 10 ether - fee;

        escrow.releaseFunds();

        assertEq(address(seller).balance, sellerBalanceBefore + sellerAmount);
        assertEq(address(this).balance, agentBalanceBefore + fee);
        assertEq(uint256(escrow.escrowState()), uint256(Escrow.EscrowState.COMPLETE));
    }

    /// @notice Test raising and resolving dispute
    function testRaiseAndResolveDispute() public {
        vm.prank(buyer);
        escrow.deposit{value: 10 ether}();

        // Raise dispute
        vm.prank(buyer);
        escrow.raiseDispute();

        assertEq(uint256(escrow.escrowState()), uint256(Escrow.EscrowState.DISPUTED));
        assertTrue(escrow.disputed());

        // Resolve dispute in favor of buyer
        uint256 buyerBalanceBefore = buyer.balance;
        escrow.resolveDispute(true);

        assertEq(buyer.balance, buyerBalanceBefore + 10 ether);
        assertEq(uint256(escrow.escrowState()), uint256(Escrow.EscrowState.REFUNDED));
        assertFalse(escrow.disputed());
    }

    /// @notice Test auto-release after timeout
    function testAutoRelease() public {
        vm.prank(buyer);
        escrow.deposit{value: 10 ether}();

        vm.prank(address(seller));
        escrow.confirmDelivery();

        // Move time forward past disputeTimeout
        vm.warp(block.timestamp + disputeTimeout + 1);

        uint256 sellerBalanceBefore = address(seller).balance;
        uint256 agentBalanceBefore = address(this).balance;

        uint256 fee = (10 ether * escrowFee) / 10000;
        uint256 sellerAmount = 10 ether - fee;

        escrow.autoRelease();

        assertEq(address(seller).balance, sellerBalanceBefore + sellerAmount);
        assertEq(address(this).balance, agentBalanceBefore + fee);
        assertEq(uint256(escrow.escrowState()), uint256(Escrow.EscrowState.COMPLETE));
    }

    /// @notice Test refund buyer
    function testRefundBuyer() public {
        vm.prank(buyer);
        escrow.deposit{value: 5 ether}();

        uint256 buyerBalanceBefore = buyer.balance;

        escrow.refundBuyer();

        assertEq(buyer.balance, buyerBalanceBefore + 5 ether);
        assertEq(uint256(escrow.escrowState()), uint256(Escrow.EscrowState.REFUNDED));
    }
}
