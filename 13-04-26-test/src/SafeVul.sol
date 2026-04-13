// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract SafeVul {
  bool private locked;

  mapping(address => uint256) public balances;

  function deposit() public payable {
    balances[msg.sender] += msg.value;
  }

  modifier noReentrancy() {
    require(!locked, 'Reentrant call detected');
    locked = true;
    _;
    locked = false;
  }

  function withdraw(uint256 amount) public noReentrancy {
    require(balances[msg.sender] >= amount, 'Insufficient balance');

    balances[msg.sender] -= amount;

    (bool success, ) = msg.sender.call{value: amount}('');
    require(success, 'Transfer failed');
  }
}
