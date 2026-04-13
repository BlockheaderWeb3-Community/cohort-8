// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
     mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
         unchecked{
         balances[msg.sender] -= amount;
        }
       
    }

}
