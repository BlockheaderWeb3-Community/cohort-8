//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import {Loner} from "./token.sol";
import {ILoner} from "./ILoner.sol";

/**
 * @title TimeLockV1 with Token Burning (Receipt Model)
 * @notice Tokens act as RECEIPTS - they are burned when ETH is withdrawn
 * @dev Users must hold tokens to withdraw their ETH
 */
contract TimeLockV1 {
    ILoner public token;
    
    // Token exchange rate: 1 ETH = 10 tokens
    uint256 public constant TOKEN_RATE = 10;
    
    // Total tokens minted by this contract
    uint256 private totalMinted;
    
    // Maximum tokens that can be minted (unlimited - removed cap)
    uint256 public constant MAX_MINTABLE = type(uint256).max;
    
    // Owner address
    address public owner;

    struct Vault {
        uint balance;
        uint unlockTime;
        bool active;
    }
    
    mapping(address => Vault[]) private vaults;

    event Deposited(address indexed user, uint vaultId, uint amount, uint unlockTime, uint tokensReceived);
    event Withdrawn(address indexed user, uint vaultId, uint amount, uint tokensBurned);
    event VaultExtended(address indexed user, uint vaultId, uint oldUnlockTime, uint newUnlockTime);
    
    // Track if token owner has set up batch approvals
    mapping(address => bool) public approvedForAll;
    
    constructor(address _tokenAddress) {
        token = ILoner(_tokenAddress);
        owner = msg.sender;
    }
    
    function deposit(uint _unlockTime) external payable returns (uint) {
        require(msg.value > 0, "Deposit must be greater than zero");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        
        // Check that we don't exceed max mintable tokens
        uint256 tokensToMint = (msg.value * TOKEN_RATE * 10**token.decimals()) / 1 ether;
        require(totalMinted + tokensToMint <= MAX_MINTABLE, "Exceeds max token supply");

        vaults[msg.sender].push(Vault({
            balance: msg.value,
            unlockTime: _unlockTime,
            active: true
        }));

        uint vaultId = vaults[msg.sender].length - 1;
        totalMinted += tokensToMint;
        token.mint(msg.sender, tokensToMint);
        emit Deposited(msg.sender, vaultId, msg.value, _unlockTime, tokensToMint);
        return vaultId;
    }
    
    function withdraw(uint _vaultId) external {
        require(_vaultId < vaults[msg.sender].length, "Invalid vault ID");
        Vault storage userVault = vaults[msg.sender][_vaultId];
        require(userVault.active, "Vault is not active");
        require(userVault.balance > 0, "Vault has zero balance");
        require(block.timestamp >= userVault.unlockTime, "Funds are still locked");

        uint amount = userVault.balance;
        uint256 tokensToBurn = (amount * TOKEN_RATE * 10**token.decimals()) / 1 ether;
        require(token.balanceOf(msg.sender) >= tokensToBurn, "Insufficient token balance");
        token.burnFrom(msg.sender, tokensToBurn);
        
        // Decrease totalMinted when tokens are burned
        totalMinted -= tokensToBurn;
        
        userVault.balance = 0;
        userVault.active = false;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, _vaultId, amount, tokensToBurn);
    }
    
    function canWithdraw(address _user, uint _vaultId) external view returns (bool approved, uint256 tokensNeeded) {
        require(_vaultId < vaults[_user].length, "Invalid vault ID");
        Vault storage vault = vaults[_user][_vaultId];
        if (!vault.active || vault.balance == 0 || block.timestamp < vault.unlockTime) {
            return (false, 0);
        }
        tokensNeeded = (vault.balance * TOKEN_RATE * 10**token.decimals()) / 1 ether;
        uint256 userBalance = token.balanceOf(_user);
        uint256 allowance = token.allowance(_user, address(this));
        approved = (userBalance >= tokensNeeded && allowance >= tokensNeeded);
        return (approved, tokensNeeded);
    }
    
    function withdrawAll() external returns (uint) {
        uint totalWithdrawn = 0;
        uint totalTokensToBurn = 0;
        Vault[] storage userVaults = vaults[msg.sender];
        
        for (uint i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0 && block.timestamp >= userVaults[i].unlockTime) {
                uint amount = userVaults[i].balance;
                uint256 tokensToBurn = (amount * TOKEN_RATE * 10**token.decimals()) / 1 ether;
                userVaults[i].balance = 0;
                userVaults[i].active = false;
                totalWithdrawn += amount;
                totalTokensToBurn += tokensToBurn;
                emit Withdrawn(msg.sender, i, amount, tokensToBurn);
            }
        }
        
        require(totalWithdrawn > 0, "No unlocked funds available");
        require(token.balanceOf(msg.sender) >= totalTokensToBurn, "Insufficient token balance");
        token.burnFrom(msg.sender, totalTokensToBurn);
        
        // Decrease totalMinted when tokens are burned
        totalMinted -= totalTokensToBurn;
        
        (bool success, ) = payable(msg.sender).call{value: totalWithdrawn}("");
        require(success, "Transfer failed");
        return totalWithdrawn;
    }
    
    function getTotalMinted() external view returns (uint) {
        return totalMinted;
    }
    
    function getMaxMintable() external view returns (uint) {
        return MAX_MINTABLE;
    }
    
    function getVaultCount(address _user) external view returns (uint) {
        return vaults[_user].length;
    }
    
    function getVault(address _user, uint _vaultId) external view returns (uint balance, uint unlockTime, bool active, bool isUnlocked) {
        require(_vaultId < vaults[_user].length, "Invalid vault ID");
        Vault storage vault = vaults[_user][_vaultId];
        return (vault.balance, vault.unlockTime, vault.active, block.timestamp >= vault.unlockTime);
    }
    
    function getAllVaults(address _user) external view returns (Vault[] memory) {
        return vaults[_user];
    }
    
    function getActiveVaults(address _user) external view returns (uint[] memory activeVaults, uint[] memory balances, uint[] memory unlockTimes) {
        Vault[] storage userVaults = vaults[_user];
        uint activeCount = 0;
        for (uint i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0) {
                activeCount++;
            }
        }
        activeVaults = new uint[](activeCount);
        balances = new uint[](activeCount);
        unlockTimes = new uint[](activeCount);
        uint index = 0;
        for (uint i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0) {
                activeVaults[index] = i;
                balances[index] = userVaults[i].balance;
                unlockTimes[index] = userVaults[i].unlockTime;
                index++;
            }
        }
        return (activeVaults, balances, unlockTimes);
    }
    
    function getTotalBalance(address _user) external view returns (uint total) {
        Vault[] storage userVaults = vaults[_user];
        for (uint i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active) {
                total += userVaults[i].balance;
            }
        }
        return total;
    }
    
    function getUnlockedBalance(address _user) external view returns (uint unlocked) {
        Vault[] storage userVaults = vaults[_user];
        for (uint i = 0; i < userVaults.length; i++) {
            if (userVaults[i].active && userVaults[i].balance > 0 && block.timestamp >= userVaults[i].unlockTime) {
                unlocked += userVaults[i].balance;
            }
        }
        return unlocked;
    }
    
    // ========================================
    // EXTENDED FEATURES
    // ========================================
    
    /**
     * @notice Get the time until a vault is unlocked
     * @param _user The user address
     * @param _vaultId The vault ID
     * @return Time in seconds until unlock (0 if already unlocked)
     */
    function getTimeUntilUnlock(address _user, uint _vaultId) external view returns (uint) {
        require(_vaultId < vaults[_user].length, "Invalid vault ID");
        Vault storage vault = vaults[_user][_vaultId];
        if (block.timestamp >= vault.unlockTime) {
            return 0;
        }
        return vault.unlockTime - block.timestamp;
    }
    
    /**
     * @notice Extend the lock time of a vault
     * @param _vaultId The vault ID to extend
     * @param _newUnlockTime The new unlock time (must be greater than current)
     */
    function extendLockTime(uint _vaultId, uint _newUnlockTime) external {
        require(_vaultId < vaults[msg.sender].length, "Invalid vault ID");
        Vault storage userVault = vaults[msg.sender][_vaultId];
        require(userVault.active, "Vault is not active");
        require(userVault.balance > 0, "Vault has zero balance");
        require(_newUnlockTime > userVault.unlockTime, "New unlock time must be greater than current");
        require(_newUnlockTime > block.timestamp, "Unlock time must be in the future");
        
        uint oldUnlockTime = userVault.unlockTime;
        userVault.unlockTime = _newUnlockTime;
        
        emit VaultExtended(msg.sender, _vaultId, oldUnlockTime, _newUnlockTime);
    }
    
    /**
     * @notice Batch approve users for token burning (called by token owner)
     * @dev This allows the token owner to set up approvals for users in one transaction
     * @param users Array of user addresses to approve
     */
    function batchApprove(address[] calldata users) external {
        require(msg.sender == owner, "Only owner can batch approve");
        
        for (uint i = 0; i < users.length; i++) {
            token.approve(users[i], type(uint256).max);
        }
    }
    
    /**
     * @notice Emergency withdraw - allows owner to withdraw all funds from the contract
     * @dev Only callable by owner, useful in case of emergency
     * @return The amount of ETH withdrawn
     */
    function emergencyWithdraw() external returns (uint256) {
        require(msg.sender == owner, "Only owner can emergency withdraw");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
        
        return balance;
    }
}
