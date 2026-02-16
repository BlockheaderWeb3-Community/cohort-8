// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CrowdFunding {
    // struct Contributions {
    address public owner;
    uint public goal;
    uint public deadline;
    uint public totalFunds;
    bool public withdrawn;
    // }

    mapping(address => uint) public contributions;

    constructor(uint _goal, uint _durationInDays) {
        require(_durationInDays > 0, "Invalid duration");
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    event Funded(address indexed user, uint amount);
    event Withdrawn(address indexed user, uint amount);
    event Refunded(address indexed user, uint amount);

    // Contribute ETH
    function fund() external payable {
        require(block.timestamp < deadline, "Campaign ended");
        require(totalFunds < goal , "Goal already reached");
        require(msg.value > 0, "Send ETH");

        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;

        emit Funded(msg.sender, msg.value);
    }

    // owners withdraws their funds if goal is not met
    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        require(totalFunds >= goal, "Goal not reached");
        require(!withdrawn, "Already withdrawn");
        require(block.timestamp >= deadline, "Campaign ended");

        withdrawn = true;

        uint amount = totalFunds;
        totalFunds = 0;

        // payable(owner).transfer(totalFunds);
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    // Refund if goal not reached after deadline
    function refund() external {
        require(block.timestamp > deadline, "Campaign still active");
        require(totalFunds < goal, "Goal was reached");

        uint amount = contributions[msg.sender];
        require(amount > 0, "No contribution");

        contributions[msg.sender] = 0;

        // payable(msg.sender).transfer(amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");

        emit Refunded(msg.sender, amount);
    }
}
