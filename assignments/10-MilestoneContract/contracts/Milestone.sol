// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Milestone {
    uint public jobCounter;

    enum Status {
        Not_Completed,
        Completed
    }

    struct Job {
        uint id;
        address client;
        address freelancer;
        uint milestonesTotal;
        uint milestonesDone;
        uint ethPerMilestone;
        Status status;
    }

    mapping(uint => Job) public jobs;

    function createJob(address _freelancer, uint _milestones, uint _ethPerMilestone) external payable returns(uint) {
        require(msg.value == _milestones * _ethPerMilestone, "Must fund full contract upfront");

        jobCounter++;
        jobs[jobCounter] = Job({
            id: jobCounter,
            client: msg.sender,
            freelancer: _freelancer,
            milestonesTotal: _milestones,
            milestonesDone: 0,
            ethPerMilestone: _ethPerMilestone,
            status: Status.Not_Completed
        });

        return jobCounter;
    }
    
    function tickMilestone(uint _id) external {
        Job storage j = jobs[_id];
        require(msg.sender == j.freelancer, "Only freelancer can mark milestone");
        require(j.status == Status.Not_Completed, "Job completed");
        require(j.milestonesDone < j.milestonesTotal, "All milestones already done");

        j.milestonesDone += 1;
    }

    function confirmMilestone(uint _id) external {
        Job storage j = jobs[_id];
        require(msg.sender == j.client, "Only client can confirm");
        require(j.milestonesDone > 0, "No milestone to confirm");
        require(address(this).balance >= j.ethPerMilestone, "Not enough funds");

        (bool success,) = j.freelancer.call{value: j.ethPerMilestone}("");
        require(success, "Transfer failed");

        if (j.milestonesDone == j.milestonesTotal) {
            j.status = Status.Completed;
        }
    }
}