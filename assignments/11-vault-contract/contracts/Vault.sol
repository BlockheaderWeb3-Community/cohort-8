// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract Vault {
  struct VaultValue {
    uint totalAmount;
    uint unlockTimestamp;
  }

  mapping(address => VaultValue) public vaults;

  function deposit(address _user, uint _unlockTimestamp) external payable {
    require(
      (vaults[_user].unlockTimestamp) <= (block.timestamp + 360000),
      'Time too close'
    );
    // vaults[_user] = msg.sender;
    vaults[_user].unlockTimestamp = _unlockTimestamp;
    vaults[_user].totalAmount += msg.value;
  }

  function withdraw(address _user) public {
    require(
      block.timestamp >= vaults[_user].unlockTimestamp,
      'Cannot unlock ETH yet!'
    );
    (bool _success, ) = msg.sender.call{value: vaults[_user].totalAmount}('');
    require(_success, 'Withdraw failed');
    vaults[_user].unlockTimestamp = 0;
    vaults[_user].totalAmount = 0;
  }
}
