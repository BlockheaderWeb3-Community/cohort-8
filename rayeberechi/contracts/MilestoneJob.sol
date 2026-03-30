// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MilestoneJob {

    enum JobStatus { PENDING, ACTIVE, COMPLETED, CANCELLED }
    
    address public client;
    address payable public freelancer;

    uint256 public totalMilestones;
    uint256 public ethPerMilestone;
    uint256 public milestonesCompleted;

    JobStatus public status;

    modifier onlyClient() {
        require(msg.sender == client, "Only Client can call this");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only Freelancer can call this");
        _;
    }

    constructor(address _client, address payable _freelancer, uint256 _totalMilestones, uint256 _ethPerMilestone) {
        client = _client;
        freelancer = _freelancer;
        totalMilestones = _totalMilestones;
        ethPerMilestone = _ethPerMilestone;
        status = JobStatus.PENDING; 
    }

    function depositFunds() external payable onlyClient {
        require(status == JobStatus.PENDING, "Job already started or cancelled");
        
        uint256 requiredAmount = totalMilestones * ethPerMilestone;
        require(msg.value == requiredAmount, "Incorrect deposit amount");

        status = JobStatus.ACTIVE;
    }

    function approveMilestone() external onlyClient {
        require(status == JobStatus.ACTIVE, "Job is not active");
        require(milestonesCompleted < totalMilestones, "All milestones already paid");

        milestonesCompleted++;

        // Release payment for ONE milestone
        (bool success, ) = freelancer.call{value: ethPerMilestone}("");
        require(success, "Transfer failed");

        // If that was the last one, close the job
        if (milestonesCompleted == totalMilestones) {
            status = JobStatus.COMPLETED;
        }
    }

    function cancelJob() external onlyFreelancer {
        require(status == JobStatus.ACTIVE || status == JobStatus.PENDING, "Cannot cancel now");
        
        status = JobStatus.CANCELLED;

        // Refund any remaining money to the Client
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(client).call{value: balance}("");
            require(success, "Refund failed");
        }
    }
}

contract MilestoneJobFactory {

    MilestoneJob[] public allJobs;

    event JobCreated(address jobAddress, address client, address freelancer);

    function createJob(
        address payable _freelancer, 
        uint256 _totalMilestones, 
        uint256 _ethPerMilestone
    ) external {
        
        MilestoneJob newJob = new MilestoneJob(
            msg.sender,      // Client
            _freelancer, 
            _totalMilestones, 
            _ethPerMilestone
        );

        allJobs.push(newJob);
        
        emit JobCreated(address(newJob), msg.sender, _freelancer);
    }

    function getAllJobs() external view returns (MilestoneJob[] memory) {
        return allJobs;
    }
}