// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract CrowdFunding{

    struct Adashey{
        address owner;
        uint deadline;
        uint targetAmount;
        uint totalCollected;
    }

    // create a counter to give each pool a uinque ID
    uint public poolCounter;
    

    // mapping the counter to the struct which contains the details of the pool
    mapping(uint => Adashey) public fundingStorage;


    // map pool ID to (contributor address to amount)
    mapping(uint => mapping(address => uint)) public contributorsFunds;

    function createPool(uint _deadline, uint _targetAmount) external returns(uint) {
        require(_targetAmount > 0, "Must be greater than zero");
        poolCounter++;
        fundingStorage[poolCounter] = Adashey({
            owner: msg.sender,
            deadline: _deadline,
            targetAmount: _targetAmount,
            totalCollected: 0
        });

        return poolCounter;
    }


    function contribute(uint _id) external payable {
        require(fundingStorage[_id].owner != address(0), "Pool does not exist");
        require(block.timestamp < fundingStorage[_id].deadline, "Deadline passed");
        require( msg.value > 0, "Must send eth");

        // this line stores the amount each of the contributor contributed to the project in the mapping
        contributorsFunds[_id][msg.sender] += msg.value;
        // ths line refreshs the state of this transaction when a contributor contributes
        fundingStorage[_id].totalCollected += msg.value;
    }

    function withdrawFunds(uint _id) external{
        require(msg.sender == fundingStorage[_id].owner, "Only owner can withdraw");
        require(fundingStorage[_id].totalCollected >= fundingStorage[_id].targetAmount, "Target amount hasn't reached");
        require(block.timestamp >= fundingStorage[_id].deadline, "Deadline hasn't reached");
        require(fundingStorage[_id].totalCollected > 0, "Already Withdrawn");

        // Saves the total amount of contribution to this variable before reseting the state of the transaction
        uint amount = fundingStorage[_id].totalCollected;

        // prevent double withdraw 
        fundingStorage[_id].totalCollected = 0;  

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transafer failed");
    }



    // this function refunds the money of the contributors back if they want a refund and if the target the project placed didn't complete and the deadline has passed
    function refundFunds(uint _id) external {
        require(block.timestamp <= fundingStorage[_id].deadline, "Deadline has reached");
        require(contributorsFunds[_id][msg.sender] > 0, "You didn't contribute or already refunded");
        require(fundingStorage[_id].totalCollected < fundingStorage[_id].targetAmount, "Target amount has reached");


        // assigning the amount the contributor contributed to this varaible for easy access when attempting too refund. 
        uint amount = contributorsFunds[_id][msg.sender];

        // setting the state to zero to avoid double request for refund after refund
        contributorsFunds[_id][msg.sender] = 0;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transafer failed");

    }





}


