//SPDX-License-Identifier: MIT

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {Mira} from './Mira.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

pragma solidity ^0.8.28;

// deposit eth and get receipt token
// deposit eth and get nft

contract TimelockVault is ReentrancyGuard {
  Mira public immutable miraToken;
  address owner;

  struct Vault {
    uint balance;
    uint tokenBalance;
    uint unlockTime;
    bool active;
  }

  mapping(address => Vault[]) private vaults;

  constructor(address _miraToken) {
    require(_miraToken != address(0), 'Invalid token address');
    miraToken = Mira(_miraToken);
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function');

    _;
  }

  event Deposited(
    address indexed user,
    uint vaultId,
    uint amount,
    uint unlockTime
  );
  event Withdrawn(address indexed user, uint vaultId, uint amount);

  function _ethToToken(uint256 _amount) internal pure returns (uint256) {
    return _amount * 10; // 1 ETH = 10 MIRA
  }

  function deposit(
    uint256 _unlockTime
  ) external payable nonReentrant returns (uint256 vaultId) {
    require(msg.value > 0, 'Deposit must be greater than zero');
    require(_unlockTime > block.timestamp, 'Unlock time must be in the future');

    uint256 tokenAmount = _ethToToken(msg.value);

    bool success = miraToken.transfer(msg.sender, tokenAmount);

    vaults[msg.sender].push(
      Vault({
        balance: msg.value,
        tokenBalance: tokenAmount,
        unlockTime: _unlockTime,
        active: true
      })
    );

    vaultId = vaults[msg.sender].length - 1;

    emit Deposited(msg.sender, vaultId, msg.value, _unlockTime);
  }

  function withdraw(uint256 _vaultId) external nonReentrant {
    require(_vaultId < vaults[msg.sender].length, 'Invalid vault ID');

    Vault storage userVault = vaults[msg.sender][_vaultId];

    require(userVault.active, 'Vault is not active');
    require(userVault.balance > 0, 'Vault has zero balance');
    require(block.timestamp >= userVault.unlockTime, 'Funds are still locked');

    uint256 ethAmount = userVault.balance;
    uint256 tokenAmount = userVault.tokenBalance;

    // Update state FIRST (Checks-Effects-Interactions)
    userVault.balance = 0;
    userVault.tokenBalance = 0;
    userVault.active = false;

    // Burn user's Mira tokens
    miraToken.burnFrom(msg.sender, tokenAmount);

    // Transfer ETH
    (bool success, ) = payable(msg.sender).call{value: ethAmount}('');
    require(success, 'Transfer failed');

    emit Withdrawn(msg.sender, _vaultId, ethAmount);
  }

  function withdrawAll() external returns (uint) {
    uint totalWithdrawn = 0;
    Vault[] storage userVaults = vaults[msg.sender];

    for (uint i = 0; i < userVaults.length; i++) {
      if (
        userVaults[i].active &&
        userVaults[i].balance > 0 &&
        block.timestamp >= userVaults[i].unlockTime
      ) {
        uint amount = userVaults[i].balance;
        userVaults[i].balance = 0;
        userVaults[i].active = false;

        totalWithdrawn += amount;
        emit Withdrawn(msg.sender, i, amount);
      }
    }

    require(totalWithdrawn > 0, 'No unlocked funds available');

    (bool success, ) = payable(msg.sender).call{value: totalWithdrawn}('');
    require(success, 'Transfer failed');

    return totalWithdrawn;
  }

  function getVaultCount(address _user) external view returns (uint) {
    return vaults[_user].length;
  }

  function getVault(
    address _user,
    uint _vaultId
  )
    external
    view
    returns (uint balance, uint unlockTime, bool active, bool isUnlocked)
  {
    require(_vaultId < vaults[_user].length, 'Invalid vault ID');

    Vault storage vault = vaults[_user][_vaultId];
    return (
      vault.balance,
      vault.unlockTime,
      vault.active,
      block.timestamp >= vault.unlockTime
    );
  }

  function getAllVaults(address _user) external view returns (Vault[] memory) {
    return vaults[_user];
  }

  function getActiveVaults(
    address _user
  )
    external
    view
    returns (
      uint[] memory activeVaults,
      uint[] memory balances,
      uint[] memory unlockTimes
    )
  {
    Vault[] storage userVaults = vaults[_user];
    // Count active vaults
    uint activeCount = 0;
    for (uint i = 0; i < userVaults.length; i++) {
      if (userVaults[i].active && userVaults[i].balance > 0) {
        activeCount++;
      }
    }

    // Create arrays
    activeVaults = new uint[](activeCount);
    balances = new uint[](activeCount);
    unlockTimes = new uint[](activeCount);

    // Populate arrays
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

  function getUnlockedBalance(
    address _user
  ) external view returns (uint unlocked) {
    Vault[] storage userVaults = vaults[_user];
    for (uint i = 0; i < userVaults.length; i++) {
      if (
        userVaults[i].active &&
        userVaults[i].balance > 0 &&
        block.timestamp >= userVaults[i].unlockTime
      ) {
        unlocked += userVaults[i].balance;
      }
    }
    return unlocked;
  }

  function emergencyWithdraw() public onlyOwner {
    uint amount = address(this).balance;

    require(amount > 0, 'No  funds available');
    (bool success, ) = payable(owner).call{value: amount}('');
    if (!success) revert();
  }
}
