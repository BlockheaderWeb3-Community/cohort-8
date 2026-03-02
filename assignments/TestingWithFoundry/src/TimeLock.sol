//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract TimeLock {
    struct Vault {
        uint256 balance;
        uint256 unlockTime;
        bool active;
    }

    mapping(address => Vault[]) private vaults;

    event Deposited(address indexed user, uint256 vaultId, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 vaultId, uint256 amount);

    function deposit(uint256 _unlockTime) external payable returns (uint256) {
        require(msg.value > 0, "Deposit must be greater than zero");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        // Create new vault
        vaults[msg.sender].push(Vault({balance: msg.value, unlockTime: _unlockTime, active: true}));

        uint256 vaultId = vaults[msg.sender].length - 1;
        emit Deposited(msg.sender, vaultId, msg.value, _unlockTime);

        return vaultId;
    }

    function withdraw(uint256 _vaultId) external {
        require(_vaultId < vaults[msg.sender].length, "Invalid vault ID");

        Vault storage userVault = vaults[msg.sender][_vaultId];
        require(userVault.active, "Vault is not active");
        require(userVault.balance > 0, "Vault has zero balance");
        require(block.timestamp >= userVault.unlockTime, "Funds are still locked");

        uint256 amount = userVault.balance;

        // Mark vault as inactive and clear balance
        userVault.balance = 0;
        userVault.active = false;

        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, _vaultId, amount);
    }

    function withdrawAll() external returns (uint256) {
        uint256 totalWithdrawn = 0;
        Vault[] storage userVaults = vaults[msg.sender];

        for (uint256 i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0 && block.timestamp >= userVaults[i].unlockTime) {
                uint256 amount = userVaults[i].balance;
                userVaults[i].balance = 0;
                userVaults[i].active = false;

                totalWithdrawn += amount;
                emit Withdrawn(msg.sender, i, amount);
            }
        }

        require(totalWithdrawn > 0, "No unlocked funds available");

        (bool success,) = payable(msg.sender).call{value: totalWithdrawn}("");
        require(success, "Transfer failed");

        return totalWithdrawn;
    }

    function getVaultCount(address _user) external view returns (uint256) {
        return vaults[_user].length;
    }

    function getVault(address _user, uint256 _vaultId)
        external
        view
        returns (uint256 balance, uint256 unlockTime, bool active, bool isUnlocked)
    {
        require(_vaultId < vaults[_user].length, "Invalid vault ID");

        Vault storage vault = vaults[_user][_vaultId];
        return (vault.balance, vault.unlockTime, vault.active, block.timestamp >= vault.unlockTime);
    }

    function getAllVaults(address _user) external view returns (Vault[] memory) {
        return vaults[_user];
    }

    function getActiveVaults(address _user)
        external
        view
        returns (uint256[] memory activeVaults, uint256[] memory balances, uint256[] memory unlockTimes)
    {
        Vault[] storage userVaults = vaults[_user];

        // Count active vaults
        uint256 activeCount = 0;
        for (uint256 i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0) {
                activeCount++;
            }
        }

        // Create arrays
        activeVaults = new uint256[](activeCount);
        balances = new uint256[](activeCount);
        unlockTimes = new uint256[](activeCount);

        // Populate arrays
        uint256 index = 0;
        for (uint256 i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0) {
                activeVaults[index] = i;
                balances[index] = userVaults[i].balance;
                unlockTimes[index] = userVaults[i].unlockTime;
                index++;
            }
        }

        return (activeVaults, balances, unlockTimes);
    }

    function getTotalBalance(address _user) external view returns (uint256 total) {
        Vault[] storage userVaults = vaults[_user];
        for (uint256 i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active) {
                total += userVaults[i].balance;
            }
        }
        return total;
    }

    function getUnlockedBalance(address _user) external view returns (uint256 unlocked) {
        Vault[] storage userVaults = vaults[_user];
        for (uint256 i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0 && block.timestamp >= userVaults[i].unlockTime) {
                unlocked += userVaults[i].balance;
            }
        }
        return unlocked;
    }
}
