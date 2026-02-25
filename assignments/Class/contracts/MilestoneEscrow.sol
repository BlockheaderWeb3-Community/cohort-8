// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract MilestoneEscrow {
    address public immutable client;
    address public immutable freelancer;

    uint256 public immutable milestoneCount;
    uint256 public immutable amountPerMilestone;

    uint256 public approvedMilestones;   
    uint256 public releasedMilestones;   

    mapping(uint256 => bool) public completed;
    mapping(uint256 => bool) public approved;
    mapping(uint256 => uint256) public completionTime;  

    bool public cancelled;

    uint256 public constant AUTO_APPROVE_TIMEOUT = 14 days; 

   event Funded(
        address indexed client,
        address indexed freelancer,
        uint256 totalAmount,
        uint256 milestoneCount,
        uint256 amountPerMilestone
    );

    event MilestoneCompleted(
        uint256 indexed milestoneId,
        address indexed freelancer,
        uint256 timestamp
    );

    event MilestoneApproved(
        uint256 indexed milestoneId,
        address indexed approver,           
        uint256 amountReleased
    );


    event MilestoneAutoApproved(
        uint256 indexed milestoneId,
        uint256 timeoutTimestamp,
        uint256 amountReleased
    );

  
    event ContractCancelled(
        address indexed caller,
        uint256 refundAmount,
        uint256 timestamp
    );

    
    event DisputeRaised(
        uint256 indexed milestoneId,
        address indexed raiser,
        string reason
    );

  
    event AllMilestonesReleased(
      address indexed freelancer,
      uint256 totalReleased
    );

    constructor(
      address _freelancer,
        uint256 _milestoneCount,
        uint256 _amountPerMilestone
    ) payable {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client cannot be freelancer");
        require(_milestoneCount > 0, "At least one milestone required");
        require(_amountPerMilestone > 0, "Amount per milestone must be > 0");

        uint256 expectedDeposit = _milestoneCount * _amountPerMilestone;
        require(msg.value == expectedDeposit, "Must fund all milestones");

        client = msg.sender;
        freelancer = _freelancer;

        milestoneCount = _milestoneCount;
        amountPerMilestone = _amountPerMilestone;

        emit Funded(
            msg.sender,
            _freelancer,
            msg.value,
            _milestoneCount,
            _amountPerMilestone
        );
    }
    
    function markCompleted(uint256 id) public {
        require(msg.sender == freelancer, "Only freelancer can mark complete");
        require(id < milestoneCount, "Invalid milestone id");
        require(!completed[id], "Already marked as completed");
        require(!cancelled, "Contract is cancelled");

        completed[id] = true;
        completionTime[id] = block.timestamp;   

        emit MilestoneCompleted(id, msg.sender, block.timestamp);
    }

    
    function approveMilestone(uint256 id) external {
        _requireCanApprove(id);

        approved[id] = true;
        approvedMilestones++;
        releasedMilestones++;

        _safeTransfer(freelancer, amountPerMilestone);

        emit MilestoneApproved(id, msg.sender, amountPerMilestone);

        if (releasedMilestones == milestoneCount) {
            emit AllMilestonesReleased(freelancer, address(this).balance);
        }
    }

    
    function autoApprove(uint256 id) external {
        _requireCanApprove(id);

        require(
            block.timestamp >= completionTime[id] + AUTO_APPROVE_TIMEOUT,
            "Timeout not reached yet"
        );

        approved[id] = true;
        approvedMilestones++;
        releasedMilestones++;

        _safeTransfer(freelancer, amountPerMilestone);

        emit MilestoneAutoApproved(id, block.timestamp, amountPerMilestone);
        emit MilestoneApproved(id, address(0), amountPerMilestone); 

        if (releasedMilestones == milestoneCount) {
            emit AllMilestonesReleased(freelancer, address(this).balance);
        }
    }

    
    function cancel() external {
        require(msg.sender == client, "Only client can cancel");
        require(!cancelled, "Already cancelled");

        cancelled = true;

        uint256 remaining = address(this).balance;
        if (remaining > 0) {
            _safeTransfer(client, remaining);
        }

        emit ContractCancelled(msg.sender, remaining, block.timestamp);
    }

    //TODO: Internal Helpers
    function _requireCanApprove(uint256 id) internal view {
        require(id < milestoneCount, "Invalid milestone id");
        require(completed[id], "Milestone not completed yet");
        require(!approved[id], "Already approved");
        require(!cancelled, "Contract is cancelled");
    }

  
    function _safeTransfer(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}("");
        require(success, "ETH transfer failed");
    }

    function isFullyReleased() external view returns (bool) {
        return releasedMilestones == milestoneCount;
    }

    function getRemainingBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function canAutoApprove(uint256 id) external view returns (bool) {
        if (id >= milestoneCount || !completed[id] || approved[id]) return false;
        return block.timestamp >= completionTime[id] + AUTO_APPROVE_TIMEOUT;
    }

    function raiseDispute(uint256 id, string calldata reason) external {
        require(msg.sender == client || msg.sender == freelancer);
        require(completed[id], "Not completed yet");
        require(!approved[id], "Already approved");

        emit DisputeRaised(id, msg.sender, reason);
    }
}
