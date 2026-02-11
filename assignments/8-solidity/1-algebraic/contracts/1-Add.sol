// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Add{
  function add(uint a, uint b) public pure returns(uint) {
    uint c = a + b;
    return c;
  }
}
