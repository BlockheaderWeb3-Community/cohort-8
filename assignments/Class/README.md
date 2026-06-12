## MilestoneEscrow

A simple and secure milestone-based escrow smart contract that enables a client to fund a project upfront and release payments to a freelancer per milestone as work is completed and approved.
This contract is designed for freelance or contractor workflows where payments are tied to deliverables instead of a single lump-sum transfer.

Contract Address: 0x5DBE332243125b5E8E71F8A59bEEC7C9EccF49Fc

Etherscan Verification:
(etherscan_link)[https://sepolia.etherscan.io/address/0x5DBE332243125b5E8E71F8A59bEEC7C9EccF49Fc]

### Overview

MilestoneEscrow allows:
A client to deposit the full project payment upfront
A freelancer to mark milestones as completed
The client (or anyone after timeout) to approve and release payments
Automatic approval after a timeout period
Cancellation with refund of remaining funds
Dispute signaling via events
Each milestone has a fixed payment amount, and funds are released incrementally.

### Roles

- Client
  Deploys and funds the contract
  Approves milestones
  Can cancel the contract and reclaim remaining funds
- Freelancer
  Marks milestones as completed
  Receives milestone payments
