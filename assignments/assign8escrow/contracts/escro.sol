 // SPDX-License-Identifier: MIT
 pragma solidity 0.8.28;

contract EscrowWithTimeout {

       //ROLES

    address public buyer;
    address public seller;
    address public escrowAgent;
    
       //ESCROW STATES

    enum EscrowState {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE
    }

    EscrowState public state;


       //TIMEOUT VARIABLES
    uint256 public depositTime;
    uint256 public deliveryDeadline;

    // Seller has 2 days to deliver
    uint256 public constant DELIVERY_TIME_LIMIT = 2 days;

    constructor(address _buyer, address _seller) {
        buyer = _buyer;
        seller = _seller;
        escrowAgent = msg.sender;

        state = EscrowState.AWAITING_PAYMENT;
    }

    
       //BUYER DEPOSITS ETHER


    function deposit() external payable {
        require(msg.sender == buyer, "Only buyer can deposit");
        require(state == EscrowState.AWAITING_PAYMENT, "Already paid");
        require(msg.value > 0, "Must send Ether");

        // Record the time of deposit
        depositTime = block.timestamp;

        // Set delivery deadline
        deliveryDeadline = block.timestamp + 172800;

        state = EscrowState.AWAITING_DELIVERY;
    }

    
       //SELLER CONFIRMS DELIVERY

    function confirmDelivery() external {
        require(msg.sender == seller, "Only seller");
        require(state == EscrowState.AWAITING_DELIVERY, "Not awaiting delivery");

        // Must deliver before deadline
        require(block.timestamp <= deliveryDeadline, "Delivery time expired");

        state = EscrowState.COMPLETE;
    }

    
       //ESCROW AGENT RELEASES FUNDS

    function releaseFunds() external {
        require(msg.sender == escrowAgent, "Only escrow agent");
        require(state == EscrowState.COMPLETE, "Escrow not complete");

        payable(seller).transfer(address(this).balance);
    }

    
       //ESCROW AGENT REFUNDS BUYER

    function refundBuyer() external {
        require(msg.sender == escrowAgent, "Only escrow agent");
        require(state == EscrowState.AWAITING_DELIVERY, "Cannot refund now");

        // Refund only allowed AFTER deadline
        require(block.timestamp > deliveryDeadline, "Delivery time not expired");

        state = EscrowState.COMPLETE;

        payable(buyer).transfer(address(this).balance);
    }
}
