// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimeVault {
   

    // VaultData struct creates a template for storing each of the user's information. 
    struct vaultData {
        address user;
        uint vaultTime;
        uint ethAmount;
        bool isActive;
    }



    // This links each of the user's address to their vaultData like a database... where the key is the address. 
    mapping(address => vaultData) public vault;
    mapping(address => bool) public hasWithdrawn;


    // Deposit function locks creatres a vault for the user, deposit ETH into the vault 
    // and locks it for a specific time which the user sets. 
    function depositVault(uint vaultTime) external payable {
        require(!vault[msg.sender].isActive, "Has already depositied");
        vault[msg.sender] = vaultData( msg.sender, vaultTime, msg.value, true);
        require(vaultTime > block.timestamp + 3600, "Too Early");
        vault[msg.sender].isActive = true;
        require(msg.value > 0, "Eth must be greater than zero");
    }



    // Withdraw function checks if every of the conditions are met, if true, "gives user access to withdraw what was saved",
    // if false, "throws error to user and waits  until conditions are met"
    function withdrawSavings() external {
        require(vault[msg.sender].vaultTime <= block.timestamp, "access granted!");
        require(!hasWithdrawn[msg.sender], "Withdrawal already made");
        require(vault[msg.sender].ethAmount > 0, "Insufficient balance");

        uint fullAmount = vault[msg.sender].ethAmount;
        vault[msg.sender].ethAmount = 0;       
        hasWithdrawn[msg.sender] = true;
        vault[msg.sender].isActive = false;


        (bool success, ) = payable(msg.sender).call{value: fullAmount}("");
        require(success, "Transfer failed");
        
    }





}