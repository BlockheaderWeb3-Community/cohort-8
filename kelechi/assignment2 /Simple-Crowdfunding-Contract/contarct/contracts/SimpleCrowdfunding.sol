// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleCrowdfunding {
    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public raisedAmount;
    mapping(address => uint256) public contributions;
    bool public withdrawn;

    constructor(uint256 _goal, uint256 _duration) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _duration;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Crowdfunding has ended");
        require(msg.value > 0, "Contribution must be greater than 0");

        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance >= goal, "Goal not met");
        require(!withdrawn, "Funds already withdrawn");

        withdrawn = true;
        payable(owner).transfer(address(this).balance);
    }

    function claimRefund() external {
        require(block.timestamp >= deadline, "Crowdfunding not yet ended");
        require(raisedAmount < goal, "Goal was met");
        require(contributions[msg.sender] > 0, "No contribution to refund");

        uint256 amount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        
        payable(msg.sender).transfer(amount);
    }

    function getContribution(address _contributor) external view returns (uint256) {
        return contributions[_contributor];
    }
}
