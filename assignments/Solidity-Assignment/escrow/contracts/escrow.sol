// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {
    enum Status {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETED
    }

    // Current status (public getter created by compiler)
    Status public status;

    // Parties involved in the escrow
    address public buyer;
    address public seller;

    // Amount held in escrow (in wei)
    uint256 public amount;

    // Initialize escrow with buyer and seller addresses
    constructor(address _buyer, address _seller) {
        buyer = _buyer;
        seller = _seller;
        status = Status.AWAITING_PAYMENT;
    }

    /// Seller deposits payment
    function deposit() external payable {
        require(msg.sender == seller, "Only seller can deposit");
        require(status == Status.AWAITING_PAYMENT, "Already paid");
        require(msg.value > 0, "Amount must be more than zero");

        amount = msg.value;
        status = Status.AWAITING_DELIVERY;
    }

    /// Buyer confirms goods received
    function confirmReceipt() external {
        require(msg.sender == buyer, "Only buyer can confirm");
        require(status == Status.AWAITING_DELIVERY, "Payment not made");

        status = Status.COMPLETED; // set final state

        // Transfer the escrowed amount to the seller using `call`
        // capture success boolean and revert if transfer fails
        (bool success, ) = payable(seller).call{value: amount}("");
        require(success, "Transfer failed");
    }
}
