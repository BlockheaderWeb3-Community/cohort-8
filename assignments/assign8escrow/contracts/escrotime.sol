// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./escro.sol";

contract EscrowFactory {
    address[] public escrows;

      event EscrowCreated(
        address escrow,
        address buyer,
        address seller,
        address agent,
        uint256 amount
    );

    function createEscrow(
        address _seller,
        address _agent
     ) external payable {
        require(msg.value > 0, "Send ETH to escrow");

        EscrowWithTimeout escrow = new EscrowWithTimeout(
            msg.sender,   // buyer
            _seller
        );
        
        // Transfer the ETH to the escrow contract and call deposit
        escrow.deposit{value: msg.value}();
        
        escrows.push(address(escrow));

        emit EscrowCreated(
            address(escrow),
            msg.sender,
            _seller,
            _agent,
            msg.value
        );

         }

    function getEscrows() external view returns (address[] memory) {
        return escrows;
    }


}