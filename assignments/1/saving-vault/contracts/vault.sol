// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TimelockedVault {
    
    enum VaultStatus { 
        Empty,
        Locked 
    }

    struct Vault {
        uint amount;      
        uint unlockTime;  
        VaultStatus status; 
    }

    mapping(address => Vault) public userVaults;

    event Deposited(address indexed user, uint amount, uint unlockTime);
    event Withdrawn(address indexed user, uint amount);

    function deposit(uint _lockDurationSeconds) external payable {
       
        require(msg.value > 0, "Must deposit some ETH");
        require(userVaults[msg.sender].status == VaultStatus.Empty, "Vault already active");

        
        uint unlockTimestamp = block.timestamp + _lockDurationSeconds;

        userVaults[msg.sender] = Vault({
            amount: msg.value,
            unlockTime: unlockTimestamp,
            status: VaultStatus.Locked
        });

        emit Deposited(msg.sender, msg.value, unlockTimestamp);
    }

    function withdraw() external {
        Vault storage myVault = userVaults[msg.sender];

        require(myVault.status == VaultStatus.Locked, "No active vault found");
        require(block.timestamp >= myVault.unlockTime, "Funds are still locked");

        uint amountToTransfer = myVault.amount;

        
        delete userVaults[msg.sender];

        // The Transfer
        (bool success, ) = payable(msg.sender).call{value: amountToTransfer}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(msg.sender, amountToTransfer);
    }
}