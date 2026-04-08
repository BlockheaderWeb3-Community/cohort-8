// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MilestoneV2 {

    struct Job {
        address payable client;
        address payable freelance;   
        uint256 totalMilestones;
        uint256 ethPerMilestone;
        uint256 totalFundRequire;    
        uint256 currentMilestone;
        bool isCompleted;
    }

    uint256 public jobCount;
    uint256 public constant AUTO_APPROVE_TIME = 3 days;

    mapping(uint256 => Job) public Jobs;


    mapping(uint256 => mapping(uint256 => bool)) public milestoneSubmitted;

    
    mapping(uint256 => mapping(uint256 => bool)) public milestoneApproved;

    
    mapping(uint256 => mapping(uint256 => uint256)) public milestoneSubmitTime;

    constructor(uint256 _ethPerMilestone, uint256 _milestones) payable {
        require(msg.value == _milestones * _ethPerMilestone, "Incorrect ETH sent");

        Job storage job = Jobs[jobCount];
        job.client = payable(msg.sender);
        job.freelance = payable(address(0));
        job.ethPerMilestone = _ethPerMilestone;
        job.totalMilestones = _milestones;
        job.totalFundRequire = msg.value;
        job.currentMilestone = 0;

        jobCount++;
    }

    function takeJob(address payable _freelancer, uint256 _jobId) external {
        Job storage job = Jobs[_jobId];
        require(job.freelance == address(0), "Job already taken");
        job.freelance = _freelancer;
    }

    function submitMilestone(uint256 _jobId) external {
        Job storage job = Jobs[_jobId];

        require(msg.sender == job.freelance, "Only freelancer");
        require(job.currentMilestone < job.totalMilestones, "All done");

        uint256 mId = job.currentMilestone;

        require(!milestoneSubmitted[_jobId][mId], "Already submitted");

        milestoneSubmitted[_jobId][mId] = true;
        milestoneSubmitTime[_jobId][mId] = block.timestamp;
    }

    function approveMilestone(uint256 _jobId) public {
        Job storage job = Jobs[_jobId];

        require(msg.sender == job.client, "Only client");
        _releaseMilestone(_jobId);
    }

    function autoApproveMilestone(uint256 _jobId) external {
        Job storage job = Jobs[_jobId];
        uint256 mId = job.currentMilestone;

        require(milestoneSubmitted[_jobId][mId], "Not submitted");
        require(
            block.timestamp >= milestoneSubmitTime[_jobId][mId] + AUTO_APPROVE_TIME,
            "Too early"
        );

        _releaseMilestone(_jobId);
    }

    function _releaseMilestone(uint256 _jobId) internal {
        Job storage job = Jobs[_jobId];
        uint256 mId = job.currentMilestone;

        require(milestoneSubmitted[_jobId][mId], "Not submitted");
        require(!milestoneApproved[_jobId][mId], "Already approved");

        milestoneApproved[_jobId][mId] = true;

        (bool success, ) = job.freelance.call{value: job.ethPerMilestone}("");
        require(success, "ETH transfer failed");

        job.currentMilestone++;

        if (job.currentMilestone == job.totalMilestones) {
            job.isCompleted = true;
        }
    }
}
