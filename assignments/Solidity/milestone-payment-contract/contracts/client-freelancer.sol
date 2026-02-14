// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ClientAndFreelancer{

    address client;
    address freelancer;
    uint public totalMilestonePrice;
    uint counter;
    uint pricePerMilestone;
    bool createdMilestones;
    mapping(uint => Milestone) public milestones;
    mapping(uint => uint) completedMilestones;

    constructor(address _client, address _freelancer) {
        client = _client;
        freelancer = _freelancer;
    }

    enum Status {
        Pending,
        Completed,
        Approved
    }

    struct Milestone{
        string description;
        uint price;
        Status status;
    }


    function createMilestones(string memory _description, uint _price) public {
        require(msg.sender == client, "client must call function");
        counter++;
        milestones[counter] = Milestone(_description, _price, Status.Pending);
        totalMilestonePrice += _price;
        createdMilestones = true;
    }

    function fundMilestones() public payable{
        require(msg.sender == client);
        require(createdMilestones == true, "Create milestones first");
        require(msg.value == totalMilestonePrice * 1 ether, "Client must pay actuel amount");
    }

    function markMilestone(uint _num) public{
        require(msg.sender == freelancer, "Freelancer must call function");
        require(_num <= counter, "Invalid milestone");

        Milestone storage challenge = milestones[_num];
        challenge.status = Status.Completed;

        pricePerMilestone = challenge.price;

        completedMilestones[_num] += pricePerMilestone;
        
    }


    function releaseFund(uint _num) public {
        require(msg.sender == client, "Client must call function");
        require(_num <= counter, "Invalid milestone");

        uint amount =  completedMilestones[_num] * 1 ether;
        (bool success,) = freelancer.call{value: amount}(" ");
        require(success, "transcation failed");
        totalMilestonePrice -= completedMilestones[_num];
    }

}