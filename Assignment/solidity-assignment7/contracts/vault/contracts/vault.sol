// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract TimelockedSavingsVault {
    struct Vault {
        uint256 amount;
        uint256 unlockTime;
        bool active;
    }

    uint256 public constant LOCK_DURATION = 24 hours; // Fixed lock duration for every deposit.

    mapping(address => Vault) private vaults;

    event Deposit(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdraw(address indexed user, uint256 amount);

    function deposit(uint256 unlockTime) external payable {
        require(msg.value > 0, "Deposit must be > 0");
        require(unlockTime == block.timestamp + 24 hours, "Unlock time must be exactly 24h");
        require(!vaults[msg.sender].active, "Vault already active");

        vaults[msg.sender] = Vault({
            amount: msg.value,
            unlockTime: unlockTime,
            active: true
        });

        emit Deposit(msg.sender, msg.value, unlockTime);
    }

    function withdraw() external {
        Vault storage v = vaults[msg.sender];
        require(v.active, "No active vault");
        require(block.timestamp >= v.unlockTime, "Too early");
        uint256 amount = v.amount;
        require(amount > 0, "No balance");

        v.amount = 0;
        v.active = false;
        v.unlockTime = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdraw failed");
        emit Withdraw(msg.sender, amount);
    }

    function getVault(address user) external view returns (uint256 amount, uint256 unlockTime, bool active) {
        Vault storage v = vaults[user];
        return (v.amount, v.unlockTime, v.active);
    }

    receive() external payable {
        revert("Direct ETH not allowed");
    }

    fallback() external payable {
        revert("Direct ETH not allowed");
    }
}
