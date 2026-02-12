
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract SimpleEscrow { // One escrow deal: buyer, seller, owner (arbiter).
  enum EscrowState { 
    AWAITING_PAYMENT, 
    AWAITING_SELLER_CONFIRMATION, 
    AWAITING_BUYER_CONFIRMATION, 
    COMPLETE 
    }
    
  address public buyer;
  address public seller;
  address public owner;
  uint256 public amount;
  EscrowState public state;

  constructor(address _buyer, address _seller, address _owner) {
    require(_buyer != address(0), "Buyer cannot be zero");
    require(_seller != address(0), "Seller cannot be zero");
    require(_owner != address(0), "Owner cannot be zero");
    require(_buyer != _seller, "Buyer cannot be seller");
    require(_buyer != _owner, "Buyer cannot be owner");
    require(_seller != _owner, "Seller cannot be owner");
    buyer = _buyer;
    seller = _seller;
    owner = _owner;
    state = EscrowState.AWAITING_PAYMENT;
  }

  function deposit() external payable {
    require(msg.sender == buyer, "Only buyer can deposit");
    require(state == EscrowState.AWAITING_PAYMENT, "Not awaiting payment");
    require(msg.value > 0, "Must send ETH");
    amount = msg.value;
    state = EscrowState.AWAITING_SELLER_CONFIRMATION;
  }

  function confirmDelivery() external {
    require(msg.sender == seller, "Only seller can confirm");
    require(state == EscrowState.AWAITING_SELLER_CONFIRMATION, "Not awaiting seller");
    state = EscrowState.AWAITING_BUYER_CONFIRMATION;
  }

  function confirmReceived() external {
    require(msg.sender == buyer, "Only buyer can confirm");
    require(state == EscrowState.AWAITING_BUYER_CONFIRMATION, "Not awaiting buyer");
    state = EscrowState.COMPLETE;
  }

  function fundsRelease() external {
    require(msg.sender == owner, "Only owner can release");
    require(state == EscrowState.COMPLETE, "Not complete");
    require(amount > 0, "No funds");
    uint256 payout = amount;
    amount = 0;
    payable(seller).transfer(payout);
  }

  function fundsRefund() external {
    require(msg.sender == owner, "Only owner can refund");
    require(state == EscrowState.COMPLETE, "Not complete");
    require(amount > 0, "No funds");
    uint256 payout = amount;
    amount = 0;
    payable(buyer).transfer(payout);
  }

}

contract MultiEscrowFactory { // Deploys many SimpleEscrow contracts and tracks them by id.
  uint256 public nextId;
  mapping(uint256 => address) public escrowById;
  address[] public escrows;

  event EscrowCreated(address escrow, address buyer, address seller, address owner);

  function createEscrow(address _seller, address _owner) external returns (uint256, address) {
    SimpleEscrow escrow = new SimpleEscrow(msg.sender, _seller, _owner);
    uint256 id = nextId;
    nextId = id + 1;
    escrowById[id] = address(escrow);
    escrows.push(address(escrow));
    emit EscrowCreated(address(escrow), msg.sender, _seller, _owner);
    return (id, address(escrow));
  }

  function escrowsCount() external view returns (uint256) {
    return escrows.length;
  }

  function getEscrows() external view returns (address[] memory) {
    return escrows;
  }
}
