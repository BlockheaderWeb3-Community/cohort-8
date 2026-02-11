// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract SubtractionContract {
  function subtract(uint a, uint b) public pure returns(uint) {
    uint d = a - b;
    return d;
  }
}

contract SubtractionFactory {
  // SubtractionFactory subtraction;

  function creatNewSub() public returns(address) {
    SubtractionContract _subtraction = new SubtractionContract();

    return address(_subtraction);
  }
}
