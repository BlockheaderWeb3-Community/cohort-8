// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CounterV3 {
  uint public x;
  address public owner;

  event Increment(uint by);
  event Decrement(uint by);

  mapping(address => bool) public authorized;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
  }

  modifier onlyAuthorized() {
    require(msg.sender == owner || authorized[msg.sender] == true, "Not authorized");
    _;
  }

  function inc() public onlyAuthorized {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public onlyAuthorized {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }

  // Decrease by 1
  function dec() public onlyAuthorized {
    require(x > 0, "Counter cannot go below 0.");
    x -= 1;
    emit Decrement(1);
  }

  // Decrement by a specific amount
  function decBy(uint amount) public onlyAuthorized {
    require(amount > 0, "Amount must be greater than 0.");
    require(x >= amount, "Counter cannot go below 0.");
    x -= amount;
    emit Decrement(amount);
  }

  function grantAccess(address user) external onlyOwner {
    authorized[user] = true;
  }

  function revokeAccess(address user) external onlyOwner {
    // Revoke access can never be owner
    // Check for address zero modifier - always have the address zero modifier
    authorized[user] = false;
  }
}
