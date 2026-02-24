// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract FreeLance {
   address public client;
    address payable public freelancer;
    uint256 public totalMilestones;
    uint256 public completed;
    uint256 public perMilestone;
    bool public isSubmitted;

    modifier only(address account) {
        require(msg.sender == account, "Unauthorized");
        _;
    }

    constructor(address payable _freelancer, uint256 _count) payable {
        require(msg.value > 0 && _count > 0);
        client = msg.sender;
        freelancer = _freelancer;
        totalMilestones = _count;
        perMilestone = msg.value / _count;
    }

    // Freelancer marks milestone as done
    function submit() external only(freelancer) {
        require(completed < totalMilestones && !isSubmitted, "Cannot submit");
        isSubmitted = true;
    }

    // Client approves and releases ETH
    function approve() external only(client) {
        require(isSubmitted, "Nothing to approve");
        
        isSubmitted = false;
        completed++;
        
        // On final milestone, send the full remaining balance
       uint256 amount = (completed == totalMilestones) ? address(this).balance : perMilestone;


        (bool success, ) = freelancer.call{value: amount}("");
        require(success, "Transfer failed");
    }
}