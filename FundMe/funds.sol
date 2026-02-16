// SPDX-License-Identifier: MIT
pragma solidity  0.8.28;

contract SimpleCrowdfunding {
    address public owner;
    uint256 public fundingGoal;
    uint256 public deadline;
    uint256 public totalRaised;
    
    mapping(address => uint256) public contributions;
    mapping(address => bool) public hasClaimedRefund;
    
    enum State { Active, Successful, Failed }
    State public state;
    
    event ContributionMade(address contributor, uint256 amount);
    event FundsWithdrawn(uint256 amount);
    event RefundClaimed(address contributor, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }
    
    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline not reached yet");
        _;
    }
    
    modifier inState(State _state) {
        require(state == _state, "Invalid state for this operation");
        _;
    }
    
    constructor(uint256 _fundingGoal, uint256 _durationInDays) {
        owner = msg.sender;
        fundingGoal = _fundingGoal;
        deadline = block.timestamp + (_durationInDays * 1 days);
        state = State.Active;
    }
    
    function contribute() external payable beforeDeadline inState(State.Active) {
        require(msg.value > 0, "Contribution must be greater than 0");
        
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        
        emit ContributionMade(msg.sender, msg.value);
        
        // Check if goal is reached
        if (totalRaised >= fundingGoal) {
            state = State.Successful;
        }
    }
    
    function checkIfGoalReached() external afterDeadline {
        if (totalRaised >= fundingGoal) {
            state = State.Successful;
        } else {
            state = State.Failed;
        }
    }
    
    function withdrawFunds() external onlyOwner inState(State.Successful) {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(amount);
    }
    
    function claimRefund() external inState(State.Failed) {
        require(contributions[msg.sender] > 0, "No contribution to refund");
        require(!hasClaimedRefund[msg.sender], "Refund already claimed");
        
        uint256 refundAmount = contributions[msg.sender];
        hasClaimedRefund[msg.sender] = true;
        
        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Transfer failed");
        
        emit RefundClaimed(msg.sender, refundAmount);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }
        return deadline - block.timestamp;
    }
    
    function getRefundAmount(address contributor) external view returns (uint256) {
        if (state == State.Failed && !hasClaimedRefund[contributor]) {
            return contributions[contributor];
        }
        return 0;
    }
    
    // Fallback function to prevent accidental ETH sends
    receive() external payable {
        revert("Please use the contribute() function");
    }
}