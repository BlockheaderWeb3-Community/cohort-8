// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract basicEscrow {
  address public buyer;
  address public seller;
  address public owner;

  enum EscrowState {
    AWAITING_PAYMENT,
    AWAITING_DELIVERY,
    COMPLETE
  }

  EscrowState public state;

  constructor(address _seller, address _owner) {
    buyer = msg.sender;
    require(_seller != address(0), 'Seller cannot be zero');
    require(_seller != buyer, 'Seller cannot be buyer');
    require(_owner != address(0), 'Owner cannot be zero');
    require(_owner != buyer, 'Owner cannot be buyer');
    seller = _seller;
    owner = _owner;
    state = EscrowState.AWAITING_PAYMENT;
  }

  // Buyers Deposit Eth
  function deposit() external payable {
    require(msg.sender == buyer, 'Only the buyer can deposit Eth');
    require(state == EscrowState.AWAITING_PAYMENT, 'Payment already received');
    require(msg.value > 0, 'Must send Eth');
    state = EscrowState.AWAITING_DELIVERY;
  }

  // Buyers Confirmation
  function confirmDelivery() external {
    require(msg.sender == buyer, 'Only the buyer can confirm');
    require(state == EscrowState.AWAITING_DELIVERY, 'Not awaiting');
    state = EscrowState.COMPLETE;
  }

  // Owner release funds
  function fundsRelease() external {
    require(msg.sender == owner, 'Only the owner can release funds');
    require(state == EscrowState.COMPLETE, 'Not complete');
    require(address(this).balance > 0, 'No funds to release');
    payable(seller).transfer(address(this).balance);
  }

  // Owner refund funds
  function fundsRefund() external {
    require(msg.sender == owner, 'Only the owner can refund funds');
    require(state == EscrowState.COMPLETE, 'Not complete');
    require(address(this).balance > 0, 'No funds to refund');
    payable(buyer).transfer(address(this).balance);
  }
}
