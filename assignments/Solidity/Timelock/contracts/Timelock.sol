// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimelockedVault {
    struct Vault {
        uint256 amount;
        uint256 unlockTime;
        bool status;
    }

    mapping(address => Vault) public vaults;



    //Deposits ETH into a vault. 
    function deposit(uint256 _unlockTime) public payable {
        require(msg.value > 0, "Make a minimum deposit greater than 0Eth");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        vaults[msg.sender] = Vault({
            amount: msg.value,
            unlockTime: _unlockTime,
            status: true
        });
    }

    // Withdraws the full balance after the timelock expires
    function withdraw() public{
        Vault storage userVault = vaults[msg.sender];

        require(userVault.status, "No active vault found");
        require(block.timestamp >= userVault.unlockTime, "Vault is still locked");

        uint256 amount = userVault.amount;


        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

    }
}