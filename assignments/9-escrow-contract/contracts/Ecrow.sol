// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.31;

contract Escrow {
  uint public transactionCount = 1;
  address public contractAddress;

  enum State {
    AWAITING_PAYMENT,
    AWAITING_DELIVERY,
    AWAITING_FUNDS_DISBURSEMENT,
    COMPLETE
  }

  struct Order {
    uint id;
    address buyer;
    address seller;
    uint amount;
    State status;
  }

  mapping(uint => Order) public orders;

  constructor() {
    contractAddress = msg.sender;
  }

  modifier notAddressZero(address _addr) {
    require(_addr != address(0), 'Address cant be address zero');
    _;
  }

  modifier onlyBuyer(uint _id) {
    require(
      msg.sender == orders[_id].buyer,
      'Only buyer can call this function'
    );
    _;
  }

  modifier onlySeller(uint _id) {
    require(
      msg.sender == orders[_id].seller,
      'Only seller can call this function'
    );
    _;
  }

  modifier onlyContract() {
    require(
      msg.sender == contractAddress,
      'Only Contract can call this function'
    );
    _;
  }

  modifier validState(uint _id, State _state) {
    require(_state == orders[_id].status, 'Invalid state');
    _;
  }

  modifier paymentMade(uint _id) {
    require(
      address(this).balance >= orders[_id].amount && address(this).balance > 0,
      'Amount not paid'
    );
    _;
  }

  function createOrder(address _buyer, address _seller) public {
    orders[transactionCount].id = transactionCount;
    orders[transactionCount].buyer = _buyer;
    orders[transactionCount].seller = _seller;
    orders[transactionCount].status = State.AWAITING_PAYMENT;
    transactionCount++;
  }

  function deposit(
    uint _id
  ) public payable onlyBuyer(_id) validState(_id, State.AWAITING_PAYMENT) {
    orders[_id].amount = msg.value;
    orders[_id].status = State.AWAITING_PAYMENT;
  }

  function sendDelivery(
    uint _transactionCount
  )
    public
    paymentMade(_transactionCount)
    validState(_transactionCount, State.AWAITING_PAYMENT)
  {
    orders[_transactionCount].status = State.AWAITING_FUNDS_DISBURSEMENT;
  }

  function releaseFundsToSeller(
    uint _id
  )
    external
    onlyContract
    paymentMade(_id)
    validState(_id, State.AWAITING_FUNDS_DISBURSEMENT)
  {
    Order memory _order = orders[_id];

    (bool success, ) = _order.seller.call{value: _order.amount}('');
    require(success, 'Transfer failed');
    _order.status = State.COMPLETE;
    orders[_id] = _order;
  }

  function refundFundsToBuyer(
    uint _id
  )
    external
    onlyContract
    paymentMade(_id)
    validState(_id, State.AWAITING_DELIVERY)
  {
    Order storage _order = orders[_id];

    (bool success, ) = _order.buyer.call{value: _order.amount}('');
    require(success, 'Refund failed');
  }
}
