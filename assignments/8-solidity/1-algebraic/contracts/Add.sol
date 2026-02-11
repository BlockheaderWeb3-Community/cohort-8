// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Add{
  uint public a;
  uint public b;

  constructor(uint _a, uint _b) {
    a = _a;
    b = _b;
  }

  function add(uint _a, uint _b) public pure returns(uint) {
    uint c = _a + _b;
    return c;
  }
}
