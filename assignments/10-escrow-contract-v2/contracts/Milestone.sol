// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract Client {
  uint public milCount;

  enum Status {
    PENDING,
    COMPLETED
  }

  struct Milestone {
    Status status;
    uint amount;
    address client;
    address freelancer;
  }

  event Log(string indexed message);

  mapping(uint => Milestone) public milAmount;

  function createMilestone(uint _amount, address _addr) public {
    milCount++;
    milAmount[milCount].client = msg.sender;
    milAmount[milCount].amount = _amount;
    milAmount[milCount].status = Status.PENDING;
    milAmount[milCount].freelancer = _addr;
  }

  function fundContract(uint _id, uint _amount) public payable {
    require(
      msg.sender == milAmount[_id].client,
      'Only Client can fund contract'
    );
    milAmount[milCount].client = msg.sender;
    milAmount[milCount].amount = _amount;
    emit Log('Fund contract');
  }

  function markMilestone(uint _id) public {
    require(
      msg.sender == milAmount[_id].freelancer,
      'Only Freelancer can mark milestone'
    );
    milAmount[_id].status = Status.COMPLETED;
    emit Log('Completed');
  }

  function payClient(uint _id) public {
    require(
      msg.sender == milAmount[_id].client,
      'Only Client can fund contract'
    );
    (bool success, ) = milAmount[_id].freelancer.call{
      value: milAmount[_id].amount
    }('');
    require(success, 'Transaction failed');
    emit Log('Paid');
  }
}
