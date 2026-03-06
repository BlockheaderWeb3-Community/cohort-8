// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Timelock{
    address user;
    mapping(address => uint) userbalance;
    mapping(address => uint) public locktime;

    constructor(address _user) {
        user = _user;
    }

    function deposit() public payable {
        require(msg.sender == user, "Not your account");
        require(msg.value > 0, "ETH must be greater than zero");
        userbalance[msg.sender] += msg.value;
        locktime[msg.sender] = block.timestamp + 3600;

    }

    function withdraw() public {
        require(msg.sender == user, "Can't withdraw, not your account");
        require(block.timestamp >= locktime[user], "Time's not up");

        uint amount =  address(this).balance;

        (bool success,) = user.call{value: amount}(" ");
        require(success, "transcation failed");


    }
}