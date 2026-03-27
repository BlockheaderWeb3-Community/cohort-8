// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract MilestoneEscrow {
  struct Job {
    address client;
    address freelancer;
    uint256 milestoneCount;
    uint256 amountPerMilestone;
    bool funded;
    uint256 paidCount;
    bool[] completed;
    bool[] approved;
  }

  uint256 public nextJobId;
  mapping(uint256 => Job) private jobs;

  event JobCreated(uint256 jobId, address client, address freelancer, uint256 milestoneCount, uint256 amountPerMilestone);
  event JobFunded(uint256 jobId, uint256 totalAmount);
  event MilestoneCompleted(uint256 jobId, uint256 milestoneIndex);
  event MilestoneApproved(uint256 jobId, uint256 milestoneIndex, uint256 amountPaid);
  event JobCompleted(uint256 jobId);

  function createJob(address freelancer, uint256 milestoneCount, uint256 amountPerMilestone) external returns (uint256) {
    require(freelancer != address(0), "Freelancer cannot be zero");
    require(freelancer != msg.sender, "Client cannot be freelancer");
    require(milestoneCount > 0, "Milestones must be > 0");
    require(amountPerMilestone > 0, "Amount must be > 0");

    uint256 jobId = nextJobId;
    nextJobId = jobId + 1;

    Job storage job = jobs[jobId];
    job.client = msg.sender;
    job.freelancer = freelancer;
    job.milestoneCount = milestoneCount;
    job.amountPerMilestone = amountPerMilestone;
    job.funded = false;
    job.paidCount = 0;
    job.completed = new bool[](milestoneCount);
    job.approved = new bool[](milestoneCount);

    emit JobCreated(jobId, msg.sender, freelancer, milestoneCount, amountPerMilestone);
    return jobId;
  }

  function fundJob(uint256 jobId) external payable {
    Job storage job = jobs[jobId];
    require(msg.sender == job.client, "Only client can fund");
    require(!job.funded, "Already funded");
    require(job.milestoneCount > 0, "Job not found");
    uint256 total = job.milestoneCount * job.amountPerMilestone;
    require(msg.value == total, "Incorrect funding amount");

    job.funded = true;
    emit JobFunded(jobId, total);
  }

  function markCompleted(uint256 jobId, uint256 milestoneIndex) external {
    Job storage job = jobs[jobId];
    require(msg.sender == job.freelancer, "Only freelancer");
    require(job.funded, "Not funded");
    require(milestoneIndex < job.milestoneCount, "Invalid milestone");
    require(!job.completed[milestoneIndex], "Already completed");

    job.completed[milestoneIndex] = true;
    emit MilestoneCompleted(jobId, milestoneIndex);
  }

  function approveMilestone(uint256 jobId, uint256 milestoneIndex) external {
    Job storage job = jobs[jobId];
    require(msg.sender == job.client, "Only client");
    require(job.funded, "Not funded");
    require(milestoneIndex < job.milestoneCount, "Invalid milestone");
    require(job.completed[milestoneIndex], "Not completed");
    require(!job.approved[milestoneIndex], "Already approved");

    job.approved[milestoneIndex] = true;
    job.paidCount += 1;

    (bool ok, ) = payable(job.freelancer).call{value: job.amountPerMilestone}("");
    require(ok, "Payment failed");
    emit MilestoneApproved(jobId, milestoneIndex, job.amountPerMilestone);

    if (job.paidCount == job.milestoneCount) {
      emit JobCompleted(jobId);
    }
  }

  function getJob(uint256 jobId)
    external
    view
    returns (
      address client,
      address freelancer,
      uint256 milestoneCount,
      uint256 amountPerMilestone,
      bool funded,
      uint256 paidCount
    )
  {
    Job storage job = jobs[jobId];
    return (job.client, job.freelancer, job.milestoneCount, job.amountPerMilestone, job.funded, job.paidCount);
  }

  function milestoneStatus(uint256 jobId, uint256 milestoneIndex) external view returns (bool isCompleted, bool isApproved) {
    Job storage job = jobs[jobId];
    require(milestoneIndex < job.milestoneCount, "Invalid milestone");
    return (job.completed[milestoneIndex], job.approved[milestoneIndex]);
  }
}
