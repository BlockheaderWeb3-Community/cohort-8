// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Crowdfunding {

    address public immutable owner;
    uint256 public immutable targetAmount;
    uint256 public immutable deadline;
    
    uint256 public totalRaised;

   
    mapping(address => uint256) public contributions;

    // --- Events ---
    event Contributed(address indexed contributor, uint256 amount);
    event RefundClaimed(address indexed contributor, uint256 amount);
    event GoalReached(uint256 totalAmount);

    constructor(uint256 _targetAmount, uint256 _durationSeconds) payable {
        owner = msg.sender;
        targetAmount = _targetAmount;
        deadline = block.timestamp + _durationSeconds;
    }

    // Investors Coming In
    function contribute(uint256 _amount) external payable {
        require(block.timestamp < deadline, "Funding period has ended");
        require(msg.value == _amount, "Sent ETH does not match _amount argument");
        require(msg.value > 0, "Contribution must be greater than 0");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit Contributed(msg.sender, msg.value);
    }

    // Contributors pulling there money because the was not reached
    function refundButtom() external {
        // Security Checks
        require(block.timestamp >= deadline, "Deadline has not reached");
        require(totalRaised < targetAmount, "Target Achieved");
        
        uint256 amountToRefund = contributions[msg.sender];
        require(amountToRefund > 0, "Baba You No Contribute Na");

        // This solves Double Refund
        contributions[msg.sender] = 0;

        // Processing Refund
        (bool success, ) = payable(msg.sender).call{value: amountToRefund}("");
        require(success, "Transfer failed");

        emit RefundClaimed(msg.sender, amountToRefund);
    }

    // Target Achieved Withdrawal Function
    function withdrawFunds() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        require(block.timestamp >= deadline, "Wait until the deadline to withdraw");
        require(totalRaised >= targetAmount, "Funding goal has not been reached");

        
        (bool success, ) = payable(owner).call{value: totalRaised}("");
        require(success, "Payout to owner failed");

        emit GoalReached(totalRaised);
    }
}