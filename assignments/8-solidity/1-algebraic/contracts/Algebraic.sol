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

contract SubtractionContract {
  function subtract(uint _a, uint _b) public pure returns(uint) {
    uint d = _a - _b;
    return d;
  }
}

contract Average is Add {
  constructor(uint _a, uint _b) Add(_a, _b) {}
  
  function average(uint a, uint b) public pure returns(uint) {
    uint d = add(a,b) / 2;

    return d;
  }
}
