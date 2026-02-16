//  SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimelockedVault {

    struct Vault {
        uint amount;
        uint unlockTime;
        bool active;
    }

    mapping(address => Vault) public vaults;

    event Deposited(address indexed user, uint amount, uint unlockTime);
    event Withdrawn(address indexed user, uint amount);

    // Deposit ETH with a chosen unlock time
    function deposit(uint _unlockTime) external payable {
        require(msg.value > 0, "Must send ETH");
        require(
            _unlockTime > block.timestamp &&
            _unlockTime <= block.timestamp + 365 days,
            "Invalid unlock time"
        );

        // User cannot deposit again if a vault is active
        require(!vaults[msg.sender].active, "Vault already active");

        vaults[msg.sender] = Vault(
            msg.value,
            _unlockTime,
            true
        );

        emit Deposited(msg.sender, msg.value, _unlockTime);
    }

    // Withdraw ETH after unlock time
    function withdraw() external {
        Vault storage vault = vaults[msg.sender];

        require(vault.active, "No active vault");
        require(block.timestamp >= vault.unlockTime, "Funds are locked");
        require(vault.amount > 0, "No funds");

        uint amount = vault.amount;

        vault.amount = 0;
        vault.active = false;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }
}
