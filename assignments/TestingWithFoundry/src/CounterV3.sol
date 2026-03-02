// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CounterV3 {
  uint public x;
  address public owner;
  mapping(address => bool) public privileged;

  event Increment(uint by);
  event Decrement(uint by);
  event PrivilegeGranted(address user);

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwnerOrPrivileged() {
    require(msg.sender == owner || privileged[msg.sender], "Not authorized");
    _;
  }

  function grantPrivilege(address user) public {
    require(msg.sender == owner, "Not owner");
    privileged[user] = true;
    emit PrivilegeGranted(user);
  }

  function inc() public onlyOwnerOrPrivileged {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public onlyOwnerOrPrivileged {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }

  function decrease(uint by) public onlyOwnerOrPrivileged {
    require(x >= by, "Cannot decrease below zero");
    x -= by;
    emit Decrement(by);
  }
}
