// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract TimelockedVault {

    struct Savings {
        uint balance;
        uint unlockTime;
    }

    mapping(address => Savings) public savings;

    function deposit(uint _unlockTime) external payable {
        Savings storage s = savings[msg.sender];

        require(msg.value > 0, "Deposit must be greater than 0");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        require(s.balance == 0, "Vault already active");

        s.balance = msg.value;
        s.unlockTime = _unlockTime;
    }

    function withdraw() external {
        Savings storage s = savings[msg.sender];

        require(s.balance > 0, "No active vault");
        require(block.timestamp >= s.unlockTime, "Vault is still locked");

        uint amount = s.balance;

        s.balance = 0;
        s.unlockTime = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    receive() external payable {
        revert("Use deposit function");
    }

    fallback() external payable {
        revert("Use deposit function");
    }
}