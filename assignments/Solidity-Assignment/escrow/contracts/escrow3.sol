// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.28; 

contract BasicEscrow { 
    // State Management 
    // Added AWAITING_RELEASE to give confirmDelivery a purpose 
    enum State { AWAITING_PAYMENT, 
    AWAITING_DELIVERY, 
    AWAITING_RELEASE, 
    COMPLETE } 
    State public currentState; 

    // Participants 
    address public buyer; 
    address public seller; 
    address public escrowAgent; 
    uint256 public amount; 

    // Events (Good for frontend tracking) 
    event FundsDeposited(address indexed buyer, uint256 amount); 
    event DeliveryConfirmed(address indexed seller); 
    event FundsReleased(address indexed seller, uint256 amount); 

    // Modifiers for Access Control 
    modifier onlyBuyer() { 
        require(msg.sender == buyer, "Only the buyer can perform this action."); 
        _; 
        } 
        modifier onlyEscrowAgent() { 
        require(msg.sender == escrowAgent, "Only the escrow agent can perform this action."); 
        _; 
        
        } 
            
    constructor(address _buyer, address _seller) { 
        buyer = _buyer; 
        seller = _seller; 
        escrowAgent = msg.sender; 
        currentState = State.AWAITING_PAYMENT; 
        } 
            
    /// Buyer deposits funds into the contract 
    function deposit() external payable onlyBuyer { 
        require(currentState == State.AWAITING_PAYMENT, "Already paid or complete."); 
        require(msg.value > 0, "Must deposit some Ether."); 

        amount = msg.value; currentState = State.AWAITING_DELIVERY; 
        emit FundsDeposited(msg.sender, msg.value); } 
        
    // Seller confirms delivery (updates state) 
    /// This fixes the "view" warning by changing currentState 
    function confirmDelivery() external {
        require(msg.sender == seller, "Only the seller can confirm delivery."); 
        require(currentState == State.AWAITING_DELIVERY, "Not in delivery phase."); 
        
        currentState = State.AWAITING_RELEASE; emit DeliveryConfirmed(msg.sender); 
        
        } 
        
    /// Agent releases funds to the seller 
    function releaseFunds() external onlyEscrowAgent { 
    
    // Updated to require the new state 
        require(currentState == State.AWAITING_RELEASE, "Cannot release: Delivery not confirmed."); 
        currentState = State.COMPLETE; payable(seller).transfer(amount); 
        emit FundsReleased(seller, amount); 
    
    } 
    /// Agent refunds the buyer 
    function refundBuyer() external onlyEscrowAgent { require(currentState != State.COMPLETE, "Cannot refund: Already complete."); 
    currentState = State.COMPLETE; payable(buyer).transfer(amount); 
    } 
    }