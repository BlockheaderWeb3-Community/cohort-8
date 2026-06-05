// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Escrow {
    address public buyer;
    address public seller;
    address public owner;

    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE
    }

    State public state;

    event SuccessfulDeposit(address buyer, string text);
    event DeliveryMade(address seller);
    event FundsReleased(address seller, uint amount);
    event FundsRefunded(address buyer, uint amount);

    constructor(address _buyer, address _seller) {
        buyer = _buyer;
        seller = _seller;
        owner = msg.sender;
        state = State.AWAITING_PAYMENT;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function deposit() external payable {
        require(msg.sender == buyer, "Unauthorized");
        require(msg.value > 0, "Must send a value");
        require(state == State.AWAITING_PAYMENT, "Function is not supposed to be called at this moment");

        state = State.AWAITING_DELIVERY;
        emit SuccessfulDeposit(msg.sender, "Deposit made successfully");
    }

    function confirm() external {
        require(msg.sender == seller, "Unauthorized");
        require(state == State.AWAITING_DELIVERY, "Function is not supposed to be called at this moment");
        emit DeliveryMade(msg.sender);
    }

    function releaseFunds() external onlyOwner {
        require(state == State.AWAITING_DELIVERY, "Function is not supposed to be called at this moment");

        state = State.COMPLETE;
        uint amount = address(this).balance;
        (bool success,) = seller.call{value: amount}("");
        require(success, "transaction failed");
        emit FundsReleased(seller, amount);
    }

    function refundFunds() external onlyOwner {
        require(state == State.AWAITING_DELIVERY, "Function is not supposed to be called at this moment");

        state = State.COMPLETE;
        uint amount = address(this).balance;
        (bool success,) = buyer.call{value: amount}("");
        require(success, "transaction failed");
        emit FundsRefunded(buyer, amount);
    }
}