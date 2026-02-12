// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./escrow.sol";

contract EscrowFactory {
    event EscrowCreated(
        address indexed escrowAddress,
        address indexed buyer,
        address indexed seller,
        address escrowAgent
    );

    function createEscrow(
        address payable _seller,
        address _escrowAgent
    ) external returns (address) {
        Escrow newEscrow = new Escrow(msg.sender, _seller, _escrowAgent);
        emit EscrowCreated(
            address(newEscrow),
            msg.sender,
            _seller,
            _escrowAgent
        );
        return address(newEscrow);
    }
}
