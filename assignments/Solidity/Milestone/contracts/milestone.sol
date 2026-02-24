// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Milestone {
    address public client;
    address payable public freelancer;
    uint public amount;

    enum Status {
        CONTRACT_FUNDED,
        FUNDING_CONFIRMED,
        MILESTONE_APPROVED,
        COMPLETED,
        REFUNDED
    }

    Status public status;

    event JobCreated(address freelancer, uint amount);
    event FundingConfirmed(address client);
    event MilestoneApproved(address client);
    event FundsReleased(address freelancer, uint amount);
    event FundsRefunded (address client, uint amount);

    modifier onlyClient() {
        require(msg.sender == client, "Only client allowed");
        _;
    }

    constructor(address payable _freelancer) {
        client = msg.sender; // deployer is client
        freelancer = _freelancer;
    }

    function fundContract() external payable onlyClient {
        require(msg.value > 0, "Must send ETH");
        require(status == Status(0), "Already funded");

        amount = msg.value;
        status = Status.CONTRACT_FUNDED;

        emit JobCreated(freelancer, msg.value);
    }

    function confirmFunding() external onlyClient {
        require(status == Status.CONTRACT_FUNDED, "Contract not funded yet");
        status = Status.FUNDING_CONFIRMED;

        emit FundingConfirmed(msg.sender);
    }

    function approveMilestone() external onlyClient {
        require(status == Status.FUNDING_CONFIRMED, "Funding not confirmed yet");
        status = Status.MILESTONE_APPROVED;

        emit MilestoneApproved(msg.sender);
    }
function refundClient() external onlyClient {
    require(status == Status.CONTRACT_FUNDED || status == Status.FUNDING_CONFIRMED, "cannot refund after approval");
    require (amount > 0, "No funds to refund");

    uint refundAmount = amount;
    amount = 0;
    status = Status.REFUNDED;

    (bool success,) = payable (client).call{value: refundAmount}("");
    require(success, "Refund failed");

    emit FundsRefunded(client, refundAmount);
}
    // Release funds to freelancer
    function releaseFunds() external onlyClient {
        require(status == Status.MILESTONE_APPROVED, "Milestone not approved yet");
        require(amount > 0, "No funds to release");

        uint payout = amount;
        // amount = 0;
        status = Status.COMPLETED;

        (bool success,) = freelancer.call{value: payout}("");
        require(success, "Transfer failed");

        emit FundsReleased(freelancer, payout);
    }
}
