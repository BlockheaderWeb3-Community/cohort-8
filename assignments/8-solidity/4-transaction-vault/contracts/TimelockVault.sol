// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimelockVault {

    address public immutable user;
    uint256 public immutable unlockTime;

    enum Status {
        CREATED,
        LOCKED,
        UNLOCKED
    }

    Status public status;

    event VaultCreated(address indexed user, uint256 amount, uint256 unlockTime);
    event VaultWithdrawn(address indexed user, uint256 amount);

    modifier onlyUser() {
        require(msg.sender == user, "Only user");
        _;
    }

    constructor(uint256 _lockDuration) payable {
        require(msg.value > 0, "No ETH sent");

        user = msg.sender;
        unlockTime = block.timestamp + _lockDuration;
        status = Status.LOCKED;

        emit VaultCreated(user, msg.value, unlockTime);
    }

    function withdraw() external onlyUser {
        require(status == Status.LOCKED, "Already withdrawn");
        require(block.timestamp >= unlockTime, "Vault still locked");

        status = Status.UNLOCKED;

        uint256 balance = address(this).balance;

        (bool ok, ) = user.call{value: balance}("");
        require(ok, "ETH transfer failed");

        emit VaultWithdrawn(user, balance);
    }
}




