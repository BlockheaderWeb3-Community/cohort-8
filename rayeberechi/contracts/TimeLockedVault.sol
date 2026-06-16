// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// --- 1. THE CHILD CONTRACT (The Vault) ---
contract TimeLockedVault {
    
    address public owner;
    uint256 public unlockTime;

    // Requirement: "Contract must reject direct ETH transfers"

    constructor(address _owner, uint256 _unlockTime) payable {
        require(msg.value > 0, "Must deposit ETH to create vault");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        
        owner = _owner;
        unlockTime = _unlockTime;
    }

    function withdraw() external {
        // Requirement: "No one can withdraw another user's funds"
        require(msg.sender == owner, "Only owner can withdraw");
        
        // Requirement: "User can withdraw only after block.timestamp >= unlockTime"
        require(block.timestamp >= unlockTime, "Vault is still locked");

        uint256 amount = address(this).balance;
        require(amount > 0, "Vault is empty");

        // Requirement: "Full balance must be withdrawn at once"
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    // Helper to check balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

// --- 2. THE FACTORY CONTRACT (The Manager) ---
contract VaultFactory {

    // Requirement: "Each user can have only one active vault at a time"
    mapping(address => TimeLockedVault) public userVaults;

    event VaultCreated(address indexed user, address vaultAddress, uint256 unlockTime, uint256 amount);

    function createVault(uint256 _unlockTime) external payable {
        // 1. Check if user already has an ACTIVE vault (one with money in it)
        if (address(userVaults[msg.sender]) != address(0)) {
            uint256 existingBalance = userVaults[msg.sender].getBalance();
            require(existingBalance == 0, "You already have an active vault with funds");
        }

        require(msg.value > 0, "You must deposit ETH to create a vault");

        // 2. Create the new vault and pass the ETH
        TimeLockedVault newVault = new TimeLockedVault{value: msg.value}(msg.sender, _unlockTime);

        // 3. Update the registry
        userVaults[msg.sender] = newVault;

        emit VaultCreated(msg.sender, address(newVault), _unlockTime, msg.value);
    }

    // Helper to find your vault
    function getMyVault() external view returns (address) {
        return address(userVaults[msg.sender]);
    }
}