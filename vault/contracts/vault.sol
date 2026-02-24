// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimelockedVault {

    struct Vault {
        uint256 balance;
        uint256 unlockTime;
        bool active;
    }

    
    mapping(address => Vault) public vaults;

    function deposit(uint256 _unlockTime) external payable {
        Vault storage userVault = vaults[msg.sender];

        require(!userVault.active, "Vault already active");
        require(msg.value > 0, "Must deposit ETH");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        userVault.balance = msg.value;
        userVault.unlockTime = _unlockTime;
        userVault.active = true;
    }

    function withdraw() external {
        Vault storage userVault = vaults[msg.sender];

        require(userVault.active, "No active vault");
        require(block.timestamp >= userVault.unlockTime, "Too early to withdraw");

        uint256 amount = userVault.balance;

        
        userVault.balance = 0;
        userVault.unlockTime = 0;
        userVault.active = false;

        (bool success, ) = msg.sender.call{value:amount}("");
        require(success, "transaction failed");
    }


}
