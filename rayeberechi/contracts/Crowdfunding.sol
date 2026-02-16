// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Crowdfunding {
    
    // --- STATE VARIABLES ---
    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public totalRaised;
    
    // Track how much each person gave
    mapping(address => uint256) public contributions;

    // --- EVENTS ---
    event Contribution(address indexed contributor, uint256 amount);
    event GoalReached(uint256 totalRaised);
    event RefundClaimed(address indexed contributor, uint256 amount);
    event OwnerWithdrawal(uint256 amount);

    git add rayeberechi
    // User sets duration in seconds (e.g., 3600 for 1 hour)
    constructor(uint256 _goal, uint256 _durationInSeconds) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _durationInSeconds;
    }

    modifier onlyAfterDeadline() {
        require(block.timestamp >= deadline, "Deadline has not passed yet");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // --- 1. CONTRIBUTE ---
    function contribute() external payable {
        require(block.timestamp < deadline, "Campaign has ended");
        require(msg.value > 0, "Must send ETH");

        // Update tracking
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit Contribution(msg.sender, msg.value);
    }

    // --- 2. OWNER WITHDRAW (Success Case) ---
    // Requirement: "If goal is met: owner can withdraw"
    function withdraw() external onlyOwner {
        require(totalRaised >= goal, "Funding goal was not met");
        
        // Note: Owner can withdraw even before deadline if goal is met.

        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        // Transfer all funds to owner
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");

        emit OwnerWithdrawal(balance);
    }

    // --- 3. USER REFUND (Failure Case) ---
    // Requirement: "If goal is not met after deadline: contributors can claim refunds"
    function refund() external onlyAfterDeadline {
        require(totalRaised < goal, "Goal was met, cannot refund");
        
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No contributions to refund");

        // --- PREVENT DOUBLE REFUND ---
        // CRITICAL: Update state BEFORE sending money (Checks-Effects-Interactions)
        contributions[msg.sender] = 0; 

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit RefundClaimed(msg.sender, amount);
    }

    // Helper to check time remaining
    function timeLeft() external view returns (uint256) {
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }
}