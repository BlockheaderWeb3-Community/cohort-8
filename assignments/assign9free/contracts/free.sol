// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MilestoneEscrow {

    address public client;
    address public freelancer;

    uint256 public totalMilestones;
    uint256 public milestonePrice;

    uint256 public completedMilestones;
    uint256 public approvedMilestones;

    bool public funded;
    bool public jobFinished;

    // Track which milestone is marked completed
    mapping(uint256 => bool) public milestoneCompleted;

    // Track approved milestones (prevents double payment)
    mapping(uint256 => bool) public milestoneApproved;

    // Events
    event Funded(uint256 amount);
    event MilestoneCompleted(uint256 milestoneId);
    event MilestoneApproved(uint256 milestoneId);
    event PaymentReleased(uint256 milestoneId, uint256 amount);

    constructor(
        address _freelancer,
        uint256 _totalMilestones,
        uint256 _milestonePrice
    ) {
        require(_freelancer != address(0), "Invalid freelancer");
        require(_totalMilestones > 0, "Invalid milestone count");
        require(_milestonePrice > 0, "Invalid price");

        client = msg.sender;
        freelancer = _freelancer;
        totalMilestones = _totalMilestones;
        milestonePrice = _milestonePrice;
    }

    // Client funds entire contract upfront
    function fund() external payable {
        require(msg.sender == client, "Only client");
        require(!funded, "Already funded");

        uint256 requiredAmount = totalMilestones * milestonePrice;
        require(msg.value == requiredAmount, "Incorrect funding amount");

        funded = true;

        emit Funded(msg.value);
    }

    // Freelancer marks milestone completed
    function markCompleted(uint256 milestoneId) external {
        require(msg.sender == freelancer, "Only freelancer");
        require(funded, "Not funded");
        require(milestoneId < totalMilestones, "Invalid milestone");
        require(!milestoneCompleted[milestoneId], "Already completed");

        milestoneCompleted[milestoneId] = true;
        completedMilestones++;

        emit MilestoneCompleted(milestoneId);
    }

    // Client approves milestone and releases payment
    function approveMilestone(uint256 milestoneId) external {
        require(msg.sender == client, "Only client");
        require(milestoneCompleted[milestoneId], "Not completed");
        require(!milestoneApproved[milestoneId], "Already approved");

        milestoneApproved[milestoneId] = true;
        approvedMilestones++;

        // Release payment
        payable(freelancer).transfer(milestonePrice);

        emit MilestoneApproved(milestoneId);
        emit PaymentReleased(milestoneId, milestonePrice);

        // Check if job finished
        if (approvedMilestones == totalMilestones) {
            jobFinished = true;
        }
    }

    // View function to check contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // View function to get milestone status
    function getMilestoneStatus(uint256 milestoneId) external view returns (bool completed, bool approved) {
        require(milestoneId < totalMilestones, "Invalid milestone");
        return (milestoneCompleted[milestoneId], milestoneApproved[milestoneId]);
    }
}