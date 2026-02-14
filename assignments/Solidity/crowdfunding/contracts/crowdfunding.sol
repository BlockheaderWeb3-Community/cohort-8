// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Crowdfunding {


    address owner;
    uint goalAmount;
    uint contributedAmount;
    uint deadline;
    bool haveSetGoal;
    bool takenRefund;
    bool withdrawn;
    mapping(address => uint256) contributors;

    constructor(address _owner) {
        owner = _owner;
    }
        
    // 604800    
    function setGoal(uint256 _goal, uint256 __deadline) public{
        require(msg.sender == owner, "Owner must call function");
        require(haveSetGoal == false, "Already set goal");
        deadline = block.timestamp + __deadline;
        goalAmount = _goal * 1 ether;
        haveSetGoal = true;
    }

    function contribute() public payable {
        require(msg.sender != owner, "Owner can't contribute");
        require(msg.value > 0, "ETH must be greater than zero");
        require(address(this).balance <= goalAmount, "Goal is met");

        contributors[msg.sender] += msg.value;
    }

    function withdraw() public {
        require(msg.sender == owner, "Owner must call function");
        require(withdrawn == false, "Already withdrawn");
        require((goalAmount == address(this).balance) && (block.timestamp >= deadline), "Haven't reached deadline");

        uint totalAmount =  address(this).balance;
        (bool success,) = msg.sender.call{value: totalAmount}(" ");
        require(success, "transcation failed");
        withdrawn = true;
    }

    function refund() public {
        require(msg.sender != owner, "Owner can't call function");
        require(takenRefund == false, "Alredy taken refund");
        require((goalAmount != address(this).balance) && (block.timestamp >= deadline), "Conditions aren't met yet");
        
        uint refundAmount = contributors[msg.sender] * 1 ether;
        (bool success,) = msg.sender.call{value: refundAmount}(" ");
        require(success, "transaction failed");
        takenRefund = true;
    }

}