// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {
    address public agent;
    address payable public buyer;
    address payable public seller;
    uint public amountReceived;

    enum Status {
        PENDING,
        PAID,
        AWAITING_CONFIRM,
        COMPLETE
    }

    Status public status;

    event EscrowFunded(address indexed seller, uint amount);
    event DeliveryConfirmed(address indexed buyer);
    event FundsReleased(address indexed seller, uint amount);
    event FundsRefunded(address indexed buyer, uint amount);

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer allowed");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller allowed");
        _;
    }

    modifier onlyAgent() {
        require(msg.sender == agent, "Only agent allowed");
        _;
    }

    constructor(address payable _buyer, address payable _seller) {
        agent = msg.sender; // factory deployer is agent
        buyer = _buyer;
        seller = _seller;
        status = Status.PENDING;
    }

    /// Seller deposits ETH into escrow
    function fundEscrow() external payable onlySeller {
        require(status == Status.PENDING, "Already funded");
        require(msg.value > 0, "Must send ETH");

        amountReceived = msg.value;
        status = Status.PAID;

        emit EscrowFunded(msg.sender, msg.value);
    }

    /// Buyer confirms delivery of goods
    function confirmDelivery() external onlyBuyer {
        require(status == Status.PAID, "Funds not deposited yet");
        status = Status.AWAITING_CONFIRM;

        emit DeliveryConfirmed(msg.sender);
    }

    /// Agent releases funds to seller
    function releaseFunds() external onlyAgent {
        require(status == Status.AWAITING_CONFIRM, "Not ready to release");
        seller.transfer(amountReceived);
        status = Status.COMPLETE;

        emit FundsReleased(seller, amountReceived);
    }

    /// Agent refunds buyer
    function refundBuyer() external onlyAgent {
        require(status == Status.AWAITING_CONFIRM, "Not ready to refund");
        buyer.transfer(amountReceived);
        status = Status.COMPLETE;

        emit FundsRefunded(buyer, amountReceived);
    }
}
