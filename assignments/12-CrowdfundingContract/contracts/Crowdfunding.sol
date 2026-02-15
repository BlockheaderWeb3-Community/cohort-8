// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Crowdfunding {
    address public owner;
    uint public goal;
    uint public deadline;
    uint public totalRaised;
    bool public withdrawn;

    mapping(address => uint) public contributions;

    constructor(uint _goal, uint _duration) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _duration;
        withdrawn = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline not yet reached");
        _;
    }

    // Users contribute ETH
    function contribute() external payable beforeDeadline {
        require(msg.value > 0, "Contribution must be > 0");
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    // Owner withdraws funds if goal is met
    function withdraw() external onlyOwner afterDeadline {
        require(totalRaised >= goal, "Goal not met");
        require(!withdrawn, "Already withdrawn");

        withdrawn = true;
        payable(owner).transfer(totalRaised);
    }

    // Contributors claim refund if goal not met
    function refund() external afterDeadline {
        require(totalRaised < goal, "Goal was met");
        uint contributed = contributions[msg.sender];
        require(contributed > 0, "No funds to refund");

        contributions[msg.sender] = 0; // prevent double refunds
        payable(msg.sender).transfer(contributed);
    }
}