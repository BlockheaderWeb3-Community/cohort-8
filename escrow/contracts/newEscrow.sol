// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {
    enum Status { PENDING, PAID, COMPLETE, REFUNDED }

    address public buyer;
    address public seller;
    Status public status;
    uint public amount;

    constructor(address _buyer, address _seller) {
        buyer = _buyer;
        seller = _seller;
        status = Status.PENDING;
    }

    
    function deposit() external payable {
        require(msg.sender == buyer, "Only buyer can deposit");
        require(status == Status.PENDING, "Escrow already funded");
        require(msg.value > 0, "Must deposit some ETH");

        amount = msg.value;
        status = Status.PAID;
    }

    
    function confirmDelivery() external {
        require(msg.sender == buyer, "Only buyer can confirm");
        require(status == Status.PAID, "Payment not done");

        status = Status.COMPLETE;

        
        (bool success, ) = payable(seller).call{value: amount}("");
        require(success, "Payment release failed");
    }

    
    function refundBuyer() external {
        require(msg.sender == buyer, "Only buyer can request refund");
        require(status == Status.PAID, "Cannot refund now");

        status = Status.REFUNDED;

        
        (bool success, ) = payable(buyer).call{value: amount}("");
        require(success, "Refund failed");
    }
}


contract EscrowFactory {
    Escrow[] public escrows; 

    
    event EscrowCreated(address escrowAddress, address buyer, address seller);

    
    function createEscrow(address _buyer, address _seller) external {
        Escrow newEscrow = new Escrow(_buyer, _seller); 
        escrows.push(newEscrow);                        

        emit EscrowCreated(address(newEscrow), _buyer, _seller); 
    }

    function getEscrowCount() external view returns (uint) {
        return escrows.length;
    }

    function getAllEscrows() external view returns (Escrow[] memory) {
        return escrows;
    }
}