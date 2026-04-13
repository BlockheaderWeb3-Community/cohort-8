// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

contract FixedVault {
    mapping(address => uint256) public balances;

    // Reentrancy guard

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    //   Fix 1 – CEI: balance updated before the external call.
    //   Fix 2 – nonReentrant: mutex blocks any re-entry attempt.
     
    function withdraw(uint256 amount) public nonReentrant {
        // CHECKS
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // EFFECTS — state change happens before any external interaction
        balances[msg.sender] -= amount;

        // INTERACTIONS — external call is now safe
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    receive() external payable {}
}
