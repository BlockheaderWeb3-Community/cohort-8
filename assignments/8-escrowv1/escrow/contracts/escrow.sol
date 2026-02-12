// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Escrow {
    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE
    }

    State public currentState;

    address public buyer;
    address payable public seller;
    address public escrowAgent;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this method");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }

    modifier onlyEscrowAgent() {
        require(
            msg.sender == escrowAgent,
            "Only escrow agent can call this method"
        );
        _;
    }

    modifier inState(State _state) {
        require(currentState == _state, "Invalid state");
        _;
    }

    event Deposit(address indexed buyer, uint256 amount);
    event DeliveryConfirmed(address indexed seller);
    event FundsReleased(address indexed seller, uint256 amount);
    event FundsRefunded(address indexed buyer, uint256 amount);

    constructor(address _buyer, address payable _seller, address _escrowAgent) {
        buyer = _buyer;
        seller = _seller;
        escrowAgent = _escrowAgent;
        currentState = State.AWAITING_PAYMENT;
    }

    function deposit()
        external
        payable
        onlyBuyer
        inState(State.AWAITING_PAYMENT)
    {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        currentState = State.AWAITING_DELIVERY;
        emit Deposit(msg.sender, msg.value);
    }

    function confirmDelivery()
        external
        onlySeller
        inState(State.AWAITING_DELIVERY)
    {
        emit DeliveryConfirmed(msg.sender);
    }

    function releaseFunds()
        external
        onlyEscrowAgent
        inState(State.AWAITING_DELIVERY)
    {
        currentState = State.COMPLETE;
        uint256 amount = address(this).balance;
        (bool success, ) = seller.call{value: amount}("");
        require(success, "Transfer to seller failed");
        emit FundsReleased(seller, amount);
    }

    function refundBuyer()
        external
        onlyEscrowAgent
        inState(State.AWAITING_DELIVERY)
    {
        currentState = State.COMPLETE;
        uint256 amount = address(this).balance;
        (bool success, ) = buyer.call{value: amount}("");
        require(success, "Transfer to buyer failed");
        emit FundsRefunded(buyer, amount);
    }
}
