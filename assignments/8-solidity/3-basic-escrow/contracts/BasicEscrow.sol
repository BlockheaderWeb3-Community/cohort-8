// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BasicEscrow {

    address public immutable client;
    address public immutable freelancer;

    uint256 public immutable totalMilestones;
    uint256 public immutable milestoneAmount;
    uint256 public immutable approvalTimeout;

    uint256 public completedMilestones;
    uint256 public releasedMilestones;
    uint256 public lastCompletionTime;

    enum Status {
        ACTIVE,
        COMPLETE
    }

    Status public status;

    modifier onlyClient() {
        require(msg.sender == client, "Only client");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer");
        _;
    }

    constructor(
        address _client,
        address _freelancer,
        uint256 _totalMilestones,
        uint256 _milestoneAmount,
        uint256 _approvalTimeout
    ) payable {
        require(msg.value == _totalMilestones * _milestoneAmount, "Incorrect funding");

        client = _client;
        freelancer = _freelancer;
        totalMilestones = _totalMilestones;
        milestoneAmount = _milestoneAmount;
        approvalTimeout = _approvalTimeout;

        status = Status.ACTIVE;
    }

    // Freelancer completes a milestone
    function markMilestoneCompleted() external onlyFreelancer {
        require(status == Status.ACTIVE, "Not active");
        require(completedMilestones < totalMilestones, "All completed");

        completedMilestones++;
        lastCompletionTime = block.timestamp;
    }

    // Client approves and pays for one milestone
    function approveMilestone() external onlyClient {
        _releasePayment();
    }

    // Freelancer forces payment if client disappears
    function claimTimeoutPayment() external onlyFreelancer {
        require(
            block.timestamp > lastCompletionTime + approvalTimeout,
            "Timeout not reached"
        );
        _releasePayment();
    }

    // Internal payment logic (gas-efficient)
    function _releasePayment() internal {
        require(status == Status.ACTIVE, "Not active");
        require(releasedMilestones < completedMilestones, "Nothing to release");

        releasedMilestones++;

        (bool ok, ) = freelancer.call{value: milestoneAmount}("");
        require(ok, "ETH transfer failed");


        if (releasedMilestones == totalMilestones) {
            status = Status.COMPLETE;
        }
    }

}
