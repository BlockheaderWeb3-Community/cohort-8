// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

contract VulnerableVault {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // unchecked mirrors pre-0.8 Solidity behaviour where integer overflow/underflow
        // was silent — this is intentionally left vulnerable for demonstration purposes.
        unchecked {
            balances[msg.sender] -= amount;
        }
    }

    receive() external payable {}
}