//SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

contract SimpleCrowdfunding {

    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public totalRaised;

    // Track how much each address contributed
    mapping(address => uint256) public contributions;

    bool public goalReached;
    bool public ownerPaid;

     //Events for frontend / logs
     event Contributed(address indexed contributor, uint256 amount);
     event FundsWithdrawn(uint256 amount);
     event Refunded(address indexed contributor, uint256 amount);

    constructor(uint256 _goal, uint256 _duration) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _duration;
    }

    
     //Contribute ETH to the campaign

    function contribute() external payable {
        require(block.timestamp < deadline, "Campaign ended");
        require(msg.value > 0, "Send ETH");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        // Check if goal is met
        if (totalRaised >= goal) {
            goalReached = true;
        }

        emit Contributed(msg.sender, msg.value);
    }

    
      //  Owner withdraws funds if goal is met
    
    function withdrawFunds() external {
        require(msg.sender == owner, "Not owner");
        require(goalReached, "Goal not reached");
        require(!ownerPaid, "Already withdrawn");

        ownerPaid = true;

        uint256 amount = address(this).balance;
        payable(owner).transfer(amount);

        emit FundsWithdrawn(amount);
    }

    
       // Contributors claim refund if goal NOT met
    
    function refund() external {
        require(block.timestamp >= deadline, "Campaign still active");
        require(!goalReached, "Goal was reached");

        uint256 amount = contributions[msg.sender];
        require(amount > 0, "Nothing to refund");

        // Update state before transfer
        contributions[msg.sender] = 0;

        payable(msg.sender).transfer(amount);

        emit Refunded(msg.sender, amount);
    }
}