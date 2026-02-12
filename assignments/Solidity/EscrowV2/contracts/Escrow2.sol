// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MilestoneEscrow {
    address  client;
    address  freelancer;
    uint256  totalMilestones;
    uint256  milestonesCounter;
    uint256 ethPerMilestone;
    bool  isJobActive;

    event JobCreated(address indexed freelancer, uint256 totalMilestones, uint256 totalAmount);
    event MilestoneApproved(uint256 milestoneIndex, uint256 amountReleased);
    event JobCompleted();

    modifier onlyClient() {
        require(msg.sender == client, "Only the client can perform this action");
        _;
    }

    constructor(address _freelancer, uint256 _totalMilestones, uint256 _ethPerMilestone) payable {
        require(_freelancer != address(0), "Invalid freelancer address");

        client = msg.sender;
        freelancer = _freelancer;
        totalMilestones = _totalMilestones;
        ethPerMilestone = _ethPerMilestone;
        isJobActive = true;

        emit JobCreated(_freelancer, _totalMilestones, msg.value);
    }


    function approveMilestone() public onlyClient {
        require(isJobActive, "Job is already finished");
        require(milestonesCounter < totalMilestones, "All milestones already paid");

        milestonesCounter++;
        if (milestonesCounter == totalMilestones) {
            isJobActive = false;
            emit JobCompleted();
        }

        // Release the payment
        (bool success, ) = freelancer.call{value: ethPerMilestone}("");
        require(success, "Transfer failed");

        emit MilestoneApproved(milestonesCounter, ethPerMilestone);
    }
}