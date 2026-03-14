// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 *  EscrowV2
 *  Milestone-based escrow for a single client–freelancer job.
 * The client funds the full amount at deployment. Each milestone is
 *      completed by the freelancer and approved by the client before payout.
 */
contract EscrowV2 {
    error OnlyClient();
    error OnlyFreelancer();
    error InvalidMilestoneId();
    error InvalidMilestoneCount();
    error InvalidValue();
    error AlreadyCompleted();
    error NotCompleted();
    error AlreadyApproved();
    error JobNotComplete();

    enum MilestoneStatus {
        Pending,
        Completed,
        Approved
    }

    address public immutable client;
    address public immutable freelancer;
    uint256 public immutable totalMilestones;
    uint256 public immutable ethPerMilestone;

    uint256 public completedCount;
    uint256 public approvedCount;

    // Per-milestone state prevents double-completion and double-approval.
    mapping(uint256 => MilestoneStatus) public milestones;

    event JobCreated(
        address indexed client,
        address indexed freelancer,
        uint256 totalMilestones,
        uint256 ethPerMilestone,
        uint256 totalFunded
    );
    event MilestoneCompleted(uint256 indexed milestoneId);
    event MilestoneApproved(uint256 indexed milestoneId, uint256 payout);
    event JobCompleted(uint256 totalPaid);

    modifier onlyClient() {
        if (msg.sender != client) revert OnlyClient();
        _;
    }

    modifier onlyFreelancer() {
        if (msg.sender != freelancer) revert OnlyFreelancer();
        _;
    }

    /**
     *  _freelancer Address of the hired freelancer.
     *  _totalMilestones Number of milestones in the job.
     *  _ethPerMilestone ETH amount released per approved milestone.
     */
    constructor(address _freelancer, uint256 _totalMilestones, uint256 _ethPerMilestone) payable {
        if (_freelancer == address(0)) revert InvalidValue();
        if (_totalMilestones == 0) revert InvalidMilestoneCount();
        if (_ethPerMilestone == 0) revert InvalidValue();

        // Enforce full upfront funding to guarantee milestone payouts.
        uint256 totalRequired = _totalMilestones * _ethPerMilestone;
        // Full upfront funding guarantees the freelancer can be paid per milestone.
        if (msg.value != totalRequired) revert InvalidValue();

        client = msg.sender;
        freelancer = _freelancer;
        totalMilestones = _totalMilestones;
        ethPerMilestone = _ethPerMilestone;

        emit JobCreated(msg.sender, _freelancer, _totalMilestones, _ethPerMilestone, msg.value);
    }

    ///  Freelancer signals that a milestone is completed.
    function markCompleted(uint256 milestoneId) external onlyFreelancer {
        if (milestoneId >= totalMilestones) revert InvalidMilestoneId();
        // Only transitions Pending -> Completed are allowed here.
        MilestoneStatus status = milestones[milestoneId];
        if (status == MilestoneStatus.Completed || status == MilestoneStatus.Approved) {
            revert AlreadyCompleted();
        }

        milestones[milestoneId] = MilestoneStatus.Completed;
        completedCount += 1;
        emit MilestoneCompleted(milestoneId);
    }

    ///  Client approves a completed milestone and releases payment.
    function approveMilestone(uint256 milestoneId) external onlyClient {
        if (milestoneId >= totalMilestones) revert InvalidMilestoneId();
        // Approval requires prior completion and is a one-way state change.
        MilestoneStatus status = milestones[milestoneId];
        if (status == MilestoneStatus.Pending) revert NotCompleted();
        if (status == MilestoneStatus.Approved) revert AlreadyApproved();

        milestones[milestoneId] = MilestoneStatus.Approved;
        approvedCount += 1;

        // Pay per milestone to avoid double-payment and keep accounting simple.
        uint256 payout = ethPerMilestone;
        (bool sent, ) = freelancer.call{value: payout}("" );
        require(sent, "PAYOUT_FAILED");

        emit MilestoneApproved(milestoneId, payout);

        if (approvedCount == totalMilestones) {
            emit JobCompleted(approvedCount * ethPerMilestone);
        }
    }

    ///  Returns true when all milestones are approved.
    function isComplete() external view returns (bool) {
        return approvedCount == totalMilestones;
    }

    ///  Remaining contract balance (unpaid milestones).
    function remainingBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
