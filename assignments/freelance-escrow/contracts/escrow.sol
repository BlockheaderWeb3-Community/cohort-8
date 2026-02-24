// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract MilestoneEscrow {
   
    enum JobStatus { 
     AwaitingPayment,
     InProgress,
     Completed 
    }

    JobStatus public status;

    struct Milestone {
        string taskName;
        uint payout;
        bool isFinished;
    }

    mapping(uint => Milestone) public milestones;
    
    mapping(address => uint) public totalEarnings;

    address public client;
    address public freelancer;
    uint public totalMilestones;
    uint public currentMilestone;

    modifier onlyClient() {
        require(msg.sender == client, "Not the client");
        _;
    }

    constructor(address _freelancer, uint _numMilestones, uint _payPerMilestone) {
        client = msg.sender;
        freelancer = _freelancer;
        totalMilestones = _numMilestones;
        status = JobStatus.AwaitingPayment;
        
    }

    // Client funds the contract
    function depositFunds() external payable onlyClient {
        require(msg.value > 0, "Must fund the contract");
        status = JobStatus.InProgress;
    }

    function releaseNextMilestone(string memory _taskName, uint _payout) external onlyClient {
        require(status == JobStatus.InProgress, "Job not active");
        require(currentMilestone < totalMilestones, "All milestones finished");


        Milestone storage m = milestones[currentMilestone];
        m.taskName = _taskName;
        m.payout = _payout;
        m.isFinished = true;

        currentMilestone++;

        if (currentMilestone == totalMilestones) {
            status = JobStatus.Completed;
        }

        totalEarnings[freelancer] += _payout;

        // Send money
        (bool success, ) = payable(freelancer).call{value: _payout}("");
        require(success, "Transfer failed");
    }
}