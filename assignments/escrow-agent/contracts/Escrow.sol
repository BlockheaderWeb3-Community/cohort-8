// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


contract Escrow {
    address public buyer;
    address public seller;
    uint public amount;
    
    enum Status { NotPaid, Paid, Done }
    Status public status;

    event FundsReceived(address indexed buyer, uint amount);
    event FundsRedeemed(address indexed seller, uint amount);

    constructor(address _buyer, address _seller) {
        buyer = _buyer;
        seller = _seller;
        status = Status.NotPaid;
    }

    // Party B (Buyer) pays the money into this specific contract
    function pay() external payable {
        require(msg.sender == buyer, "Only buyer can pay");
        require(status == Status.NotPaid, "Already paid");
        require(msg.value > 0, "Must send ETH");
        
        amount = msg.value;
        status = Status.Paid;
        emit FundsReceived(msg.sender, msg.value);
    }

    // Buyer confirms receipt and releases money to Seller
    function redeem() external {
        require(msg.sender == buyer, "Only buyer can redeem");
        require(status == Status.Paid, "Funds not deposited or already released");

        status = Status.Done;
        uint payout = amount;
        amount = 0; // Reset amount for security

        (bool success, ) = payable(seller).call{value: payout}("");
        require(success, "Transfer to seller failed");
        
        emit FundsRedeemed(seller, payout);
    }
}

    // EscrowFactory
 
contract EscrowFactory {
    address[] public allEscrows;

    event EscrowCreated(address indexed escrowAddress, address indexed buyer, address indexed seller);

    // Creates a new Escrow contract
    function createEscrow(address _seller) external returns (address) {
        
        Escrow newEscrow = new Escrow(msg.sender, _seller);
        
        address escrowAddress = address(newEscrow);
        allEscrows.push(escrowAddress);
        
        emit EscrowCreated(escrowAddress, msg.sender, _seller);
        return escrowAddress;
    }

    // Helper function to get all escrows for the frontend
    function getAllEscrows() external view returns (address[] memory) {
        return allEscrows;
    }
}