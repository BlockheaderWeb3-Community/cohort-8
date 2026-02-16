// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;




contract Escrow {
    
    // The three parties
    address public immutable buyer;
    address public immutable seller;
    address public immutable escrowAgent;
    
    // Amount held in escrow
    uint256 public amount;
    
    // Delivery confirmation tracking
    bool public deliveryConfirmed;
    
    // Timeouts
    uint256 public depositTimestamp;
    uint256 public constant BUYER_CLAIM_PERIOD = 7 days;
    uint256 public constant SELLER_CLAIM_PERIOD = 30 days;
    
    // State of the escrow
    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        DISPUTED
    }
    
    State public currentState;
    
    // Reentrancy guard
    bool private locked;
    
    // Events to log important actions
    event PaymentDeposited(address indexed buyer, uint256 amount);
    event DeliveryConfirmed(address indexed seller, uint256 timestamp);
    event FundsReleased(address indexed seller, uint256 amount);
    event FundsRefunded(address indexed buyer, uint256 amount);
    event DisputeRaised(address indexed initiator);
    
    // Custom errors (gas efficient)
    error Unauthorized();
    error InvalidState();
    error InvalidAmount();
    error TransferFailed();
    error ReentrancyDetected();
    error DeliveryNotConfirmed();
    error TooEarlyToClaim();
    
    // Modifiers for access control
    modifier onlyBuyer() {
        if (msg.sender != buyer) revert Unauthorized();
        _;
    }
    
    modifier onlySeller() {
        if (msg.sender != seller) revert Unauthorized();
        _;
    }
    
    modifier onlyEscrowAgent() {
        if (msg.sender != escrowAgent) revert Unauthorized();
        _;
    }
    
    modifier inState(State _state) {
        if (currentState != _state) revert InvalidState();
        _;
    }
    
    modifier noReentrancy() {
        if (locked) revert ReentrancyDetected();
        locked = true;
        _;
        locked = false;
    }
    
    // Constructor - sets up the three parties
    constructor(address _buyer, address _seller) {
        require(_buyer != address(0) && _seller != address(0), "Invalid addresses");
        require(_buyer != _seller, "Buyer and seller must be different");
        
        buyer = _buyer;
        seller = _seller;
        escrowAgent = msg.sender;
        currentState = State.AWAITING_PAYMENT;
    }
    
    // 1. Buyer deposits Ether
    function deposit() external payable onlyBuyer inState(State.AWAITING_PAYMENT) {
        if (msg.value == 0) revert InvalidAmount();
        
        amount = msg.value;
        depositTimestamp = block.timestamp;
        currentState = State.AWAITING_DELIVERY; 
        
        emit PaymentDeposited(buyer, amount);
    }
    
    // 2. Seller confirms delivery (NOW ACTUALLY DOES SOMETHING)
    function confirmDelivery() external onlySeller inState(State.AWAITING_DELIVERY) {
        deliveryConfirmed = true;
        emit DeliveryConfirmed(seller, block.timestamp);
    }
    
    // 3. Escrow agent releases funds to seller
    // IMPROVED: Now requires delivery confirmation
    function releaseFunds() external onlyEscrowAgent inState(State.AWAITING_DELIVERY) noReentrancy {
        if (!deliveryConfirmed) revert DeliveryNotConfirmed();
        
        currentState = State.COMPLETE;
        
        uint256 paymentAmount = amount;
        amount = 0;
        
        (bool success, ) = seller.call{value: paymentAmount}("");
        if (!success) revert TransferFailed();
        
        emit FundsReleased(seller, paymentAmount);
    }
    
    // 4. Escrow agent refunds buyer
    function refundBuyer() external onlyEscrowAgent inState(State.AWAITING_DELIVERY) noReentrancy {
        currentState = State.COMPLETE;
        
        uint256 refundAmount = amount;
        amount = 0;
        
        (bool success, ) = buyer.call{value: refundAmount}("");
        if (!success) revert TransferFailed();
        
        emit FundsRefunded(buyer, refundAmount);
    }
    
    // 5. NEW: Raise dispute (can be called by buyer or seller)
    function raiseDispute() external inState(State.AWAITING_DELIVERY) {
        if (msg.sender != buyer && msg.sender != seller) revert Unauthorized();
        
        currentState = State.DISPUTED;
        emit DisputeRaised(msg.sender);
    }
    
    // 6. NEW: Resolve dispute (escrow agent can release or refund during dispute)
    function resolveDispute(bool releaseToSeller) external onlyEscrowAgent inState(State.DISPUTED) noReentrancy {
        currentState = State.COMPLETE;
        
        uint256 paymentAmount = amount;
        amount = 0;
        
        address recipient = releaseToSeller ? seller : buyer;
        
        (bool success, ) = recipient.call{value: paymentAmount}("");
        if (!success) revert TransferFailed();
        
        if (releaseToSeller) {
            emit FundsReleased(seller, paymentAmount);
        } else {
            emit FundsRefunded(buyer, paymentAmount);
        }
    }
    
    // 7. NEW: Buyer can claim refund if seller doesn't confirm delivery within 30 days
    function claimRefundTimeout() external onlyBuyer inState(State.AWAITING_DELIVERY) noReentrancy {
        if (block.timestamp < depositTimestamp + SELLER_CLAIM_PERIOD) {
            revert TooEarlyToClaim();
        }
        
        currentState = State.COMPLETE;
        
        uint256 refundAmount = amount;
        amount = 0;
        
        (bool success, ) = buyer.call{value: refundAmount}("");
        if (!success) revert TransferFailed();
        
        emit FundsRefunded(buyer, refundAmount);
    }
    
    // 8. NEW: Seller can claim payment if buyer doesn't dispute after confirmation
    function claimPaymentTimeout() external onlySeller inState(State.AWAITING_DELIVERY) noReentrancy {
        if (!deliveryConfirmed) revert DeliveryNotConfirmed();
        if (block.timestamp < depositTimestamp + BUYER_CLAIM_PERIOD) {
            revert TooEarlyToClaim();
        }
        
        currentState = State.COMPLETE;
        
        uint256 paymentAmount = amount;
        amount = 0;
        
        (bool success, ) = seller.call{value: paymentAmount}("");
        if (!success) revert TransferFailed();
        
        emit FundsReleased(seller, paymentAmount);
    }
    
    // Helper function to check current state
    function getState() external view returns (State) {
        return currentState;
    }
    
    // Helper function to get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Helper to check if delivery was confirmed
    function isDeliveryConfirmed() external view returns (bool) {
        return deliveryConfirmed;
    }
}