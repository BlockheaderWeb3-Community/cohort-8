// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Crowdfunding {
    
    enum ProjectStatus { 
        Ongoing, 
        Successful, 
        Failed 
    }
    ProjectStatus public status;

    struct Project {
        address owner;
        uint goal;
        uint deadline;
        uint totalRaised;
    }

        Project public project;

    mapping(address => uint) public contributions;

    event Contributed(address indexed user, uint amount);
    event GoalReached(uint totalAmount);
    event RefundClaimed(address indexed user, uint amount);

    modifier onlyOwner() {
        require(msg.sender == project.owner, "Only owner can call this");
        _;
    }

    constructor(uint _goal, uint _durationInSeconds) {

        project = Project({
            owner: msg.sender,
            goal: _goal,
            deadline: block.timestamp + _durationInSeconds,
            totalRaised: 0
        });
        status = ProjectStatus.Ongoing;
    }

    function contribute() external payable {
        require(block.timestamp < project.deadline, "Deadline has passed");
        require(msg.value > 0, "Contribution must be > 0");
        require(status == ProjectStatus.Ongoing, "Project no longer accepting funds");

        contributions[msg.sender] += msg.value;

        // Update the total in STRUCT
        project.totalRaised += msg.value;

        emit Contributed(msg.sender, msg.value);
    }

    // Owner withdraws if goal is met
    function withdrawFunds() external onlyOwner {
        require(project.totalRaised >= project.goal, "Goal not reached");
        require(block.timestamp >= project.deadline, "Deadline not reached yet");
        
        status = ProjectStatus.Successful;
        uint amount = address(this).balance;

        (bool success, ) = payable(project.owner).call{value: amount}("");
        require(success, "Transfer failed");
    }

    // Contributors get money back i f goal is NOT met
    function claimRefund() external {
       
        require(block.timestamp >= project.deadline, "Deadline not reached yet");
        require(project.totalRaised < project.goal, "Goal was met, no refunds");
        
        uint amountToRefund = contributions[msg.sender];
        require(amountToRefund > 0, "No funds to claim");

        contributions[msg.sender] = 0;
        
        status = ProjectStatus.Failed;

        (bool success, ) = payable(msg.sender).call{value: amountToRefund}("");
        require(success, "Refund failed");

        emit RefundClaimed(msg.sender, amountToRefund);
    }
}