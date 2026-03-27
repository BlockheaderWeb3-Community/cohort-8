// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Escrow {
    address public buyer;
    address public seller;
    address public escrowAgent;
    bool public deliveryConfirmed;

    enum EscrowState { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE }
    EscrowState public state;

    constructor(address _buyer, address _seller) {
        require(_buyer != address(0) && _seller != address(0), "Invalid address");
        require(_buyer != _seller, "Buyer and seller must differ");
        buyer = _buyer; seller = _seller; escrowAgent = msg.sender;
        state = EscrowState.AWAITING_PAYMENT;
    }

    modifier onlyBuyer() { require(msg.sender == buyer, "Only buyer"); _; }
    modifier onlyEscrow() { require(msg.sender == escrowAgent, "Only escrow agent"); _; }
    modifier inState(EscrowState s) { require(state == s, "Invalid state"); _; }

    function deposit() external payable onlyBuyer inState(EscrowState.AWAITING_PAYMENT) {
        require(msg.value > 0, "Must deposit ETH");
        state = EscrowState.AWAITING_DELIVERY;
    }

    // Important fix: buyer confirms delivery, not seller.
    function confirmDelivery() external onlyBuyer inState(EscrowState.AWAITING_DELIVERY) {
        deliveryConfirmed = true;
    }

    // Important fix: funds can only be released after delivery is confirmed.
    function releaseFunds() external onlyEscrow inState(EscrowState.AWAITING_DELIVERY) {
        require(deliveryConfirmed, "Delivery not confirmed");
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds");
        state = EscrowState.COMPLETE;
        (bool ok, ) = payable(seller).call{value: amount}("");
        require(ok, "Release failed");
    }

    function refundBuyer() external onlyEscrow inState(EscrowState.AWAITING_DELIVERY) {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds");
        state = EscrowState.COMPLETE;
        (bool ok, ) = payable(buyer).call{value: amount}("");
        require(ok, "Refund failed");
    }

    function getEscrowBalance() external view returns (uint256) { return address(this).balance; }
}
