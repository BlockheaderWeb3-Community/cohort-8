// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimelockedSavingsVault {

    // Structure to store each user's vault
    struct Vault {
        uint256 amount;        // ETH locked
        uint256 unlockTime;    // timestamp when withdrawal is allowed
        bool active;           // ensures only one vault per user
    }

    // Mapping user address => vault
    mapping(address => Vault) public vaults;

    // Events (for frontend tracking)
    event Deposited(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 amount);

    
       // Create a vault and lock ETH
        //_lockDuration is in seconds
    
    function createVault(uint256 _lockDuration) external payable {

        // User must send ETH
        require(msg.value > 0, "Send ETH");

        // Only one active vault allowed
        require(!vaults[msg.sender].active, "Vault already exists");

        // Save vault details
        vaults[msg.sender] = Vault({
            amount: msg.value,
            unlockTime: block.timestamp + _lockDuration,
            active: true
        });

        emit Deposited(msg.sender, msg.value, block.timestamp + _lockDuration);
    }

    
       // Withdraw after unlock time
    
    function withdraw() external {

        Vault storage userVault = vaults[msg.sender];

        require(userVault.active, "No active vault");

        // Check if time has passed
        require(block.timestamp >= userVault.unlockTime, "Still locked");

        uint256 amount = userVault.amount;

        // Reset vault BEFORE sending ETH (security best practice)
        userVault.amount = 0;
        userVault.active = false;

        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    // Helper function to view vault info easily
    function getMyVault() external view returns (Vault memory) {
        return vaults[msg.sender];
    }
}
