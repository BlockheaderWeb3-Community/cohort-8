// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BasicEscrow {

  address public buyer;
  address public seller;

  uint public amount;

  enum Status {
    NOT_PAID,
    PAID,
    COMPLETE
  }

  Status public transactionStatus;

  constructor(address _buyer, address _seller) {
    buyer = _buyer;
    seller = _seller;
    transactionStatus = Status.NOT_PAID;
  }

  // Buyer deposits funds
  function deposit() external payable {
    require(msg.sender == buyer, "Only buyer can deposit");
    require(transactionStatus == Status.NOT_PAID, "Already paid");
    require(amount == 0, "Escrow already funded");
    require(msg.value > 0, "Amount must be greater than zero");

    amount += msg.value;
    transactionStatus = Status.PAID;
  }

  // Buyer confirms goods received
  function confirmDelivery() external {
    require(msg.sender == buyer, "Only buyer can confirm");
    require(transactionStatus == Status.PAID, "Payment not completed");

    uint payout = amount;
    amount = 0;
    transactionStatus = Status.COMPLETE;

    (bool success, ) = payable(seller).call{value: payout}("");
    require(success, "Transfer failed");
  }

  // Refund if business fails
  function refundBuyer() external {
    require(msg.sender == buyer, "Only buyer can refund");
    require(transactionStatus == Status.PAID, "Invalid state");

    uint refund = amount;
    amount = 0;
    transactionStatus = Status.NOT_PAID;

    (bool success, ) = payable(buyer).call{value: refund}("");
    require(success, "Refund failed");
  }
}
