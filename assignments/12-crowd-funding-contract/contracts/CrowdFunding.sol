// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract Crowd {
  struct Funding {
    uint goal;
    uint deadline;
    address ownerAddress;
  }

  struct User {
    uint amount;
    bool isRefunded;
    address userAddress;
  }

  mapping(address => User) public users;
  mapping(address => Funding) public owners;

  function createFunding(uint _goal, uint _deadline) public {
    owners[msg.sender].goal = _goal;
    owners[msg.sender].deadline = _deadline;
    owners[msg.sender].ownerAddress = msg.sender;
  }

  function deposit(uint _amount) public payable {
    users[msg.sender].amount = _amount;
    users[msg.sender].isRefunded = false;
    users[msg.sender].userAddress = msg.sender;
  }

  function withdraw() public {
    require(
      owners[msg.sender].ownerAddress == msg.sender,
      'Only owners should withdraw'
    );
    (bool success, ) = msg.sender.call{value: owners[msg.sender].goal}('');
    require(success, 'Withdraw failed!');
  }

  function refund() public {
    require(
      users[msg.sender].userAddress == msg.sender,
      'Only users should withdraw'
    );
    require(!users[msg.sender].isRefunded, 'User has been refunded');

    (bool success, ) = msg.sender.call{value: users[msg.sender].amount}('');
    require(success, 'Refund failed!');
    users[msg.sender].isRefunded = true;
  }
}
