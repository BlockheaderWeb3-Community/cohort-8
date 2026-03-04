//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {IErc20} from "./interfaces/IERC20.sol";

contract TimeLockV2 {
    IErc20 public immutable token;
    address public owner;
    address public pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    struct Vault {
        uint256 balance;
        uint256 tokenBalance;
        uint256 unlockTime;
        bool active;
    }

    constructor(address _token) {
        token = IErc20(_token);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        require(newOwner != owner, "New owner is current owner");
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        require(msg.sender == pendingOwner, "Not pending owner");
        address previousOwner = owner;
        owner = msg.sender;
        pendingOwner = address(0);
        emit OwnershipTransferred(previousOwner, msg.sender);
    }

    mapping(address => Vault[]) private vaults;

    event Deposited(address indexed user, uint256 vaultId, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 vaultId, uint256 amount);
    event EmergencyWithdrawn(address indexed owner, uint256 amount);

    //INTERNAL FUNCTIONS
    function _depositRatio(uint256 _totalDeposit) internal pure returns (uint256 _tokenAmount) {
        _tokenAmount = _totalDeposit * 10; // Token Ratio
    }

    function deposit(uint256 _unlockTime) external payable returns (uint256) {
        require(msg.value > 0, "Deposit must be greater than zero");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        uint256 tokenBal = _depositRatio(msg.value);
        require(token.transfer(msg.sender, tokenBal), "Token transfer failed");

        // Create new vault
        vaults[msg.sender].push(
            Vault({balance: msg.value, unlockTime: _unlockTime, tokenBalance: tokenBal, active: true})
        );

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
        uint256 tokenAmount = userVault.tokenBalance;

        // Mark vault as inactive and clear balance
        userVault.balance = 0;
        userVault.tokenBalance = 0;
        userVault.active = false;

        require(token.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");

        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, _vaultId, amount);
    }

    function withdrawAll() external returns (uint256) {
        uint256 totalWithdrawn = 0;
        uint256 totalTokens = 0;
        Vault[] storage userVaults = vaults[msg.sender];

        for (uint256 i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0 && block.timestamp >= userVaults[i].unlockTime) {
                uint256 amount = userVaults[i].balance;
                uint256 tokenAmount = userVaults[i].tokenBalance;

                userVaults[i].balance = 0;
                userVaults[i].tokenBalance = 0;
                userVaults[i].active = false;

                totalWithdrawn += amount;
                totalTokens += tokenAmount;
                emit Withdrawn(msg.sender, i, amount);
            }
        }

        require(totalWithdrawn > 0, "No unlocked funds available");

        require(token.transfer(msg.sender, totalTokens), "Token transfer failed");

        (bool success,) = payable(msg.sender).call{value: totalWithdrawn}("");
        require(success, "Transfer failed");

        return totalWithdrawn;
    }

    function emergencyWithdraw() external onlyOwner returns (uint256 amount) {
        amount = address(this).balance;
        require(amount > 0, "No funds available");

        (bool success,) = payable(owner).call{value: amount}("");
        if (!success) revert();

        emit EmergencyWithdrawn(owner, amount);
    }

    function getVaultCount(address _user) external view returns (uint256) {
        return vaults[_user].length;
    }

    function getVault(address _user, uint256 _vaultId)
        external
        view
        returns (uint256 balance, uint256 tokenBalance, uint256 unlockTime, bool active, bool isUnlocked)
    {
        require(_vaultId < vaults[_user].length, "Invalid vault ID");

        Vault storage vault = vaults[_user][_vaultId];
        return (vault.balance, vault.tokenBalance, vault.unlockTime, vault.active, block.timestamp >= vault.unlockTime);
    }

    function getAllVaults(address _user) external view returns (Vault[] memory) {
        return vaults[_user];
    }

    function getActiveVaults(address _user)
        external
        view
        returns (
            uint256[] memory activeVaults,
            uint256[] memory balances,
            uint256[] memory tokenBalances,
            uint256[] memory unlockTimes
        )
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
        tokenBalances = new uint256[](activeCount);
        unlockTimes = new uint256[](activeCount);

        // Populate arrays
        uint256 index = 0;
        for (uint256 i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0) {
                activeVaults[index] = i;
                balances[index] = userVaults[i].balance;
                tokenBalances[index] = userVaults[i].tokenBalance;
                unlockTimes[index] = userVaults[i].unlockTime;
                index++;
            }
        }

        return (activeVaults, balances, tokenBalances, unlockTimes);
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
