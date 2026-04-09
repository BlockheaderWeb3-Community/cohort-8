// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "./Escrow.sol";

contract EscrowFactory {
Escrow [] public escrows;

event EscrowCreated(
    address escrowAddress,
    address buyer,
    address seller
);
// buyer creates new escrow order with the seller and stores in escorws array

function createEscrow (address payable seller) external {
    Escrow escrow = new Escrow (payable(msg.sender), seller);
    escrows.push (escrow);

    emit EscrowCreated (address(escrow), msg.sender, seller);
}

/// i added it so it will return the total num of escrows
function getEscrowCount () external view returns (uint256){
    return escrows.length;
}
// retrieve the address by index and check if d index is valid then returns the escrows contract address

function getEscrow (uint index) external view returns(address) {
    require (index < escrows.length, "Index is out of range");
    return address (escrows[index]);
}
}

