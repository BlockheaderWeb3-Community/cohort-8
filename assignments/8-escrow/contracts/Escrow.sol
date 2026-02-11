// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "./BasicEscrow.sol";

// Factory contract responsible for creating and tracking escrow contracts
contract EscrowFactory {

    // Total number of escrow "businesses" created
    uint public businessCount;

    // Mapping each business Ids to business to its escrow contract address
    mapping(uint => address) public escrows;

    // Emit these when a new contract is created
    event EscrowCreated(
        uint indexed businessId,
        address escrowAddress,
        address buyer,
        address seller
    );

    // Creates a ew contract for the caller (buyer) and a receiver (seller)
    function createEscrow(address _buyer, address _seller) external returns (address) {
        BasicEscrow escrow = new BasicEscrow(_buyer, _seller);

        escrows[businessCount] = address(escrow);

        emit EscrowCreated(
            businessCount,
            address(escrow),
            _buyer,
            _seller
        );

        businessCount++;
        return address(escrow);
    }
}
