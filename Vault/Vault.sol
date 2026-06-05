// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimelockedSavingsVault {
    struct Vault {
        uint256 balance;
        uint256 unlockTime;
        bool exists;
    }
    
    mapping(address => Vault) private vaults;
    
    event Deposited(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 amount);
    
    // Modifier to check if user has an active vault
    modifier noActiveVault() {
        require(!vaults[msg.sender].exists, "Active vault exists");
        _;
    }
    
    // Modifier to check if user has a vault and can withdraw
    modifier canWithdraw() {
        Vault storage vault = vaults[msg.sender];
        require(vault.exists, "No active vault");
        require(block.timestamp >= vault.unlockTime, "Vault is still locked");
        _;
    }
    
    // Deposit function
    function deposit(uint256 unlockTime) external payable noActiveVault {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        require(unlockTime > block.timestamp, "Unlock time must be in the future");
        
        vaults[msg.sender] = Vault({
            balance: msg.value,
            unlockTime: unlockTime,
            exists: true
        });
        
        emit Deposited(msg.sender, msg.value, unlockTime);
    }
    
    // Withdraw function
    function withdraw() external canWithdraw {
        Vault storage vault = vaults[msg.sender];
        uint256 amount = vault.balance;
        
        // Reset vault before transfer to prevent reentrancy
        delete vaults[msg.sender];
        
        // Transfer funds
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    // View function to get vault details
    function getVault(address user) external view returns (Vault memory) {
        return vaults[user];
    }
    
    // Prevent direct ETH transfers
    receive() external payable {
        revert("Direct transfers not allowed. Use deposit() function.");
    }
    
    fallback() external payable {
        revert("Direct transfers not allowed. Use deposit() function.");
    }
}