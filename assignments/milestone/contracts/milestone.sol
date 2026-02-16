// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;


contract MilestoneEscrow {
    
    
    // STATE VARIABLES
    
    
    address public client;
    address public freelancer;
    uint256 public totalMilestones;
    uint256 public paymentPerMilestone;
    uint256 public milestonesCompleted;
    uint256 public milestonesPaid;
    uint256 public contractCreationTime;
    
    // Timeout periods
    uint256 public constant CLIENT_APPROVAL_TIMEOUT = 14 days;  // Client has 14 days to approve
    uint256 public constant FREELANCER_CANCEL_TIMEOUT = 30 days; // Freelancer can cancel if client inactive
    
    // Track milestone statuses
    mapping(uint256 => MilestoneStatus) public milestones;
    
    enum State {
        AWAITING_FUNDING,
        ACTIVE,
        COMPLETE,
        CANCELLED
    }
    
    State public currentState;
    
    struct MilestoneStatus {
        bool completed;      // Freelancer marked as complete
        bool approved;       // Client approved
        bool paid;          // Payment released
        uint256 completionTime; // When freelancer marked complete
    }
    
   
    // EVENTS
    
    event ContractCreated(address indexed client, address indexed freelancer, uint256 totalMilestones, uint256 paymentPerMilestone);
    event ContractFunded(uint256 totalAmount);
    event MilestoneCompleted(uint256 indexed milestoneId, uint256 timestamp);
    event MilestoneApproved(uint256 indexed milestoneId);
    event MilestonePaymentReleased(uint256 indexed milestoneId, uint256 amount);
    event ContractComplete();
    event ContractCancelled(address indexed cancelledBy, uint256 refundAmount);
    event TimeoutClaim(uint256 indexed milestoneId, address indexed claimant);
    
    // ERRORS
    
    error OnlyClient();
    error OnlyFreelancer();
    error InvalidState();
    error AlreadyFunded();
    error InsufficientFunding();
    error InvalidMilestone();
    error MilestoneNotCompleted();
    error MilestoneAlreadyCompleted();
    error MilestoneAlreadyApproved();
    error MilestoneAlreadyPaid();
    error ApprovalTimeoutNotReached();
    error CancelTimeoutNotReached();
    error TransferFailed();
    error ReentrancyDetected();
    error NoMilestonesCompleted();
    error CannotCancelWithCompletedMilestones();
    
  
    // MODIFIERS
    
    
    modifier onlyClient() {
        if (msg.sender != client) revert OnlyClient();
        _;
    }
    
    modifier onlyFreelancer() {
        if (msg.sender != freelancer) revert OnlyFreelancer();
        _;
    }
    
    modifier inState(State _state) {
        if (currentState != _state) revert InvalidState();
        _;
    }
    
    // Reentrancy guard
    uint256 private locked = 1;
    modifier noReentrancy() {
        if (locked != 1) revert ReentrancyDetected();
        locked = 2;
        _;
        locked = 1;
    }
    
    
    // CONSTRUCTOR
    

    constructor(
        address _freelancer,
        uint256 _totalMilestones,
        uint256 _paymentPerMilestone
    ) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_totalMilestones > 0, "Must have at least 1 milestone");
        require(_paymentPerMilestone > 0, "Payment must be greater than 0");
        
        client = msg.sender;
        freelancer = _freelancer;
        totalMilestones = _totalMilestones;
        paymentPerMilestone = _paymentPerMilestone;
        currentState = State.AWAITING_FUNDING;
        contractCreationTime = block.timestamp;
        
        emit ContractCreated(client, freelancer, _totalMilestones, _paymentPerMilestone);
    }
    
    
    // FUNDING
    
      // Client funds the contract with full amount upfront
     
    function fundContract() external payable onlyClient inState(State.AWAITING_FUNDING) {
        uint256 requiredAmount = totalMilestones * paymentPerMilestone;
        
        if (msg.value != requiredAmount) revert InsufficientFunding();
        
        currentState = State.ACTIVE;
        
        emit ContractFunded(msg.value);
    }
    
    // MILESTONE WORKFLOW
    
     //Freelancer marks a milestone as completed
     
    function completeMilestone(uint256 _milestoneId) 
        external 
        onlyFreelancer 
        inState(State.ACTIVE) 
    {
        if (_milestoneId >= totalMilestones) revert InvalidMilestone();
        if (milestones[_milestoneId].completed) revert MilestoneAlreadyCompleted();
        
        milestones[_milestoneId].completed = true;
        milestones[_milestoneId].completionTime = block.timestamp;
        milestonesCompleted++;
        
        emit MilestoneCompleted(_milestoneId, block.timestamp);
    }
    
    // Client approves a completed milestone
     
     
    function approveMilestone(uint256 _milestoneId) 
        external 
        onlyClient 
        inState(State.ACTIVE) 
    {
        if (_milestoneId >= totalMilestones) revert InvalidMilestone();
        if (!milestones[_milestoneId].completed) revert MilestoneNotCompleted();
        if (milestones[_milestoneId].approved) revert MilestoneAlreadyApproved();
        
        milestones[_milestoneId].approved = true;
        
        emit MilestoneApproved(_milestoneId);
        
        // Automatically release payment upon approval
        _releaseMilestonePayment(_milestoneId);
    }
    
     // Internal function to release payment for a milestone
     
    function _releaseMilestonePayment(uint256 _milestoneId) 
        internal 
        noReentrancy 
    {
        if (milestones[_milestoneId].paid) revert MilestoneAlreadyPaid();
        
        milestones[_milestoneId].paid = true;
        milestonesPaid++;
        
        (bool success, ) = freelancer.call{value: paymentPerMilestone}("");
        if (!success) revert TransferFailed();
        
        emit MilestonePaymentReleased(_milestoneId, paymentPerMilestone);
        
        // Check if all milestones are paid
        if (milestonesPaid == totalMilestones) {
            currentState = State.COMPLETE;
            emit ContractComplete();
        }
    }
    
    
    
    //    Freelancer can claim payment if client doesn't approve within timeout
       // _milestoneId Milestone number (0-indexed)
    //  Prevents client from holding payment indefinitely after work is delivered
     
    function claimMilestoneTimeout(uint256 _milestoneId) 
        external 
        onlyFreelancer 
        inState(State.ACTIVE) 
    {
        if (_milestoneId >= totalMilestones) revert InvalidMilestone();
        if (!milestones[_milestoneId].completed) revert MilestoneNotCompleted();
        if (milestones[_milestoneId].paid) revert MilestoneAlreadyPaid();
        
        uint256 completionTime = milestones[_milestoneId].completionTime;
        if (block.timestamp < completionTime + CLIENT_APPROVAL_TIMEOUT) {
            revert ApprovalTimeoutNotReached();
        }
        
        // Auto-approve and pay
        milestones[_milestoneId].approved = true;
        
        emit TimeoutClaim(_milestoneId, freelancer);
        
        _releaseMilestonePayment(_milestoneId);
    }
    
    
     // Freelancer can cancel if client is inactive (no milestones approved in 30 days)
     //  Only allowed if no milestones have been completed yet
     
    function cancelDueToInactivity() 
        external 
        onlyFreelancer 
        inState(State.ACTIVE) 
        noReentrancy 
    {
        if (milestonesCompleted > 0) revert CannotCancelWithCompletedMilestones();
        
        if (block.timestamp < contractCreationTime + FREELANCER_CANCEL_TIMEOUT) {
            revert CancelTimeoutNotReached();
        }
        
        currentState = State.CANCELLED;
        
        uint256 refundAmount = address(this).balance;
        
        (bool success, ) = client.call{value: refundAmount}("");
        if (!success) revert TransferFailed();
        
        emit ContractCancelled(freelancer, refundAmount);
    }
    
    // Client can cancel before any work is completed
     // Only allowed if freelancer hasn't marked any milestones complete
     
    function cancelByClient() 
        external 
        onlyClient 
        inState(State.ACTIVE) 
        noReentrancy 
    {
        if (milestonesCompleted > 0) revert CannotCancelWithCompletedMilestones();
        
        currentState = State.CANCELLED;
        
        uint256 refundAmount = address(this).balance;
        
        (bool success, ) = client.call{value: refundAmount}("");
        if (!success) revert TransferFailed();
        
        emit ContractCancelled(client, refundAmount);
    }
    
    
    
    //   Get milestone details
     // _milestoneId Milestone number (0-indexed)
    
    function getMilestoneStatus(uint256 _milestoneId) 
        external 
        view 
        returns (
            bool completed,
            bool approved,
            bool paid,
            uint256 completionTime
        ) 
    {
        MilestoneStatus memory milestone = milestones[_milestoneId];
        return (
            milestone.completed,
            milestone.approved,
            milestone.paid,
            milestone.completionTime
        );
    }
    
    // Get contract summary
     
    function getContractSummary() 
        external 
        view 
        returns (
            address _client,
            address _freelancer,
            uint256 _totalMilestones,
            uint256 _paymentPerMilestone,
            uint256 _milestonesCompleted,
            uint256 _milestonesPaid,
            State _currentState,
            uint256 _balance
        ) 
    {
        return (
            client,
            freelancer,
            totalMilestones,
            paymentPerMilestone,
            milestonesCompleted,
            milestonesPaid,
            currentState,
            address(this).balance
        );
    }
    
   //  Calculate remaining balance
    
    function getRemainingBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    
      // Check if milestone can be claimed via timeout
     
    function canClaimMilestoneTimeout(uint256 _milestoneId) external view returns (bool) {
        if (_milestoneId >= totalMilestones) return false;
        if (!milestones[_milestoneId].completed) return false;
        if (milestones[_milestoneId].paid) return false;
        
        uint256 completionTime = milestones[_milestoneId].completionTime;
        return block.timestamp >= completionTime + CLIENT_APPROVAL_TIMEOUT;
    }
}