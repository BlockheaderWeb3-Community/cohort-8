// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './3-StandardEscrow.sol';

contract EscrowFactory {

    uint256 public escrowCount;

    mapping(uint256 => address) public escrows;

    event EscrowCreated(uint256 indexed id, address escrow);

    function createEscrow(
      address freelancer,
      uint256 totalMilestones,
      uint256 milestoneAmount,
      uint256 approvalTimeout
    ) external payable returns (address) {
      StandardEscrow escrow = new StandardEscrow{value: msg.value}(
          msg.sender,
          freelancer,
          totalMilestones,
          milestoneAmount,
          approvalTimeout
        );
        escrows[escrowCount] = address(escrow);
        emit EscrowCreated(escrowCount, address(escrow));

        escrowCount++;
        return address(escrow);
      }
}



// Classwork  1: Milestone Payment Contract (Escrow v2)

// Context
// A client hires a freelancer and pays per milestone instead of all at once.

// Roles
// Client
// Freelancer

// Requirements

// Client creates a job with:
// freelancer address
// total number of milestones
// ETH per milestone


// Client funds the contract upfront
// Freelancer marks a milestone as completed
// Client approves the milestone
// Contract releases ETH per milestone


// Once all milestones are paid, the contract is complete
// Thought Questions
// What happens if the client disappears?
// Should the freelancer be able to cancel?
// How do you prevent double payments?
