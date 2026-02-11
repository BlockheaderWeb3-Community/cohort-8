// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './1-Add.sol';

contract Average is Add {
  function average(uint a, uint b) public pure returns(uint) {
    uint d = add(a,b) / 2;

    return d;
  }
}

