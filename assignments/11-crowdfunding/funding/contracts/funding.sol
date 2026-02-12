// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
    uint256 public fundingGoal;
    uint256 public deadline;
    uint256 public totalFunded;
    bool public goalReached;
    bool public projectClosed;

    mapping(address => uint256) public contributions;
    address[] public contributors;

    event ContributionMade(address indexed contributor, uint256 amount);
    event GoalReached(uint256 totalAmount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event RefundIssued(address indexed contributor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline has not passed");
        _;
    }

    constructor(uint256 _fundingGoal, uint256 _durationInDays) {
        owner = msg.sender;
        fundingGoal = _fundingGoal;
        deadline = block.timestamp + (_durationInDays * 1 days);
        totalFunded = 0;
        goalReached = false;
        projectClosed = false;
    }

    function contribute() public payable beforeDeadline {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(!projectClosed, "Project is closed");

        // Track new contributor
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }

        contributions[msg.sender] += msg.value;
        totalFunded += msg.value;

        emit ContributionMade(msg.sender, msg.value);

        // Check if goal is reached
        if (totalFunded >= fundingGoal && !goalReached) {
            goalReached = true;
            emit GoalReached(totalFunded);
        }
    }

    function withdraw() public onlyOwner afterDeadline {
        require(goalReached, "Funding goal not reached");
        require(!projectClosed, "Funds already withdrawn");

        projectClosed = true;
        uint256 amount = address(this).balance;

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner, amount);
    }

    function claimRefund() public afterDeadline {
        require(!goalReached, "Goal was reached, no refunds");
        require(contributions[msg.sender] > 0, "No contributions to refund");

        uint256 refundAmount = contributions[msg.sender];
        contributions[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundIssued(msg.sender, refundAmount);
    }

    function getContributorCount() public view returns (uint256) {
        return contributors.length;
    }

    function getContributionStatus()
        public
        view
        returns (uint256 funded, uint256 goal, bool deadlinePassed)
    {
        return (totalFunded, fundingGoal, block.timestamp >= deadline);
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }
        return deadline - block.timestamp;
    }

    receive() external payable {
        contribute();
    }
}
