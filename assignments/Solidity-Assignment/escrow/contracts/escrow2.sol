// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./escrow.sol";

contract EscrowFactory {
    Escrow[] public escrows;

    // Event emitted when a new Escrow is created
    event EscrowCreated(
        address escrowAddress,
        address buyer,
        address seller
    );

    /// Buyer creates a new escrow order
    function createEscrow(address seller) external {
        Escrow escrow = new Escrow(msg.sender, seller);
        escrows.push(escrow);

        emit EscrowCreated(address(escrow), msg.sender, seller);
    }

    // Helper to get the number of escrows created
    function getEscrowCount() external view returns (uint256) {
        return escrows.length;
    }
}
