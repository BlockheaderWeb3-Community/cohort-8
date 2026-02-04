// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.31;

contract Escrow {
  uint public transactAmount;
  address public buyer;
  address public seller;
  address public escrowAgent;

  enum State {
    AWAITING_PAYMENT,
    AWAITING_DELIVERY,
    AWAITING_FUNDS_DISBURSEMENT,
    COMPLETE
  }
  State public currentState;

  constructor(address _buyer, address _seller) {
    require(_buyer != address(0), 'Buyer should be a valid address');
    require(_seller != address(0), 'Seller should be a valid address');
    require(_seller != msg.sender, 'Seller cannot be escrow agent');
    require(_buyer != msg.sender, 'Buyer cannot be escrow agent');

    escrowAgent = msg.sender;
    buyer = _buyer;
    seller = _seller;
    currentState = State.AWAITING_PAYMENT;
  }

  modifier onlyBuyer() {
    require(msg.sender == buyer, 'Only buyer can call this function');
    _;
  }

  modifier onlySeller() {
    require(msg.sender == seller, 'Only seller can call this function');
    _;
  }

  modifier onlyEscrowAgent() {
    require(msg.sender == escrowAgent, 'Only Escrow Agent can call this agent');
    _;
  }

  modifier validState(State _state) {
    require(_state == currentState, 'Invalid state');
    _;
  }

  modifier paymentMade() {
    require(
      address(this).balance >= transactAmount && address(this).balance > 0,
      'Amount not paid'
    );
    _;
  }

  function deposit()
    external
    payable
    onlyBuyer
    validState(State.AWAITING_PAYMENT)
  {
    require(msg.value > 0, 'No ETH value is available');

    transactAmount = msg.value;
    currentState = State.AWAITING_DELIVERY;
  }

  function makeDelivery()
    external
    paymentMade
    onlySeller
    validState(State.AWAITING_DELIVERY)
  {
    require(address(this).balance > 0, 'No payment made');

    currentState = State.AWAITING_FUNDS_DISBURSEMENT;
  }

  function releaseFundsToSeller()
    external
    onlyEscrowAgent
    paymentMade
    validState(State.AWAITING_FUNDS_DISBURSEMENT)
  {
    require(address(this).balance > 0, 'No ETH value is available');

    (bool success, ) = seller.call{value: address(this).balance}('');
    require(success, 'Transfer failed');
    currentState = State.COMPLETE;
    transactAmount = 0;
  }

  function refundFundsToBuyer()
    external
    onlyEscrowAgent
    paymentMade
    validState(State.AWAITING_DELIVERY)
  {
    require(address(this).balance > 0, 'No ETH value is available');

    (bool success, ) = buyer.call{value: address(this).balance}('');
    require(success, 'Refund failed');
    transactAmount = 0;
  }
}
