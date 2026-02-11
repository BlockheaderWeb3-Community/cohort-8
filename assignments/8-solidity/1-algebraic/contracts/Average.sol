// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './Add.sol';

contract Average is Add {
  constructor(uint _a, uint _b) Add(_a, _b) {}
  
  function average(uint a, uint b) public pure returns(uint) {
    uint d = add(a,b) / 2;

    return d;
  }
}

