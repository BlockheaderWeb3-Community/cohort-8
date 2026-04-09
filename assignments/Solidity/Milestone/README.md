# Milestone Smart Contract

A Solidity smart contract for managing ETH-based milestone payments between a client and freelancer.

---

## Overview

This contract allows:

* A client to fund a milestone contract with ETH
* The client to confirm funding
* The client to approve the milestone
* Funds to be released to the freelancer after approval
* Refunds to the client if milestone is not approved

---

## Contract Details

* **License**: MIT
* **Solidity Version**: ^0.8.28

---

## State Variables

| Variable     | Type            | Description                                                                                           |
| ------------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| `client`     | address         | Address of the client (deployer)                                                                      |
| `freelancer` | address payable | Address of the freelancer                                                                             |
| `amount`     | uint            | Amount of ETH deposited for milestone                                                                 |
| `status`     | enum            | Current milestone status: CONTRACT_FUNDED, FUNDING_CONFIRMED, MILESTONE_APPROVED, COMPLETED, REFUNDED |

---

## Functions

### fundContract()

Client funds the contract with ETH.

**Access:** Client only

**Requirements:**

* ETH must be > 0
* Contract must not be funded already

**Notes:**

* Updates `amount` and sets `status` to `CONTRACT_FUNDED`
* Emits `JobCreated` event

---

### confirmFunding()

Client confirms that funding is correct.

**Access:** Client only

**Requirements:**

* Contract must be funded

**Notes:**

* Updates `status` to `FUNDING_CONFIRMED`
* Emits `FundingConfirmed` event

---

### approveMilestone()

Client approves the milestone work.

**Access:** Client only

**Requirements:**

* Funding must be confirmed

**Notes:**

* Updates `status` to `MILESTONE_APPROVED`
* Emits `MilestoneApproved` event

---

### releaseFunds()

Client releases milestone funds to freelancer.

**Access:** Client only

**Requirements:**

* Milestone must be approved
* Amount must be > 0

**Notes:**

* Sends ETH to freelancer
* Updates `status` to `COMPLETED`
* Emits `FundsReleased` event

---

### refundClient()

Client refunds their ETH if milestone is not approved yet.

**Access:** Client only

**Requirements:**

* Status must be `CONTRACT_FUNDED` or `FUNDING_CONFIRMED`
* Amount must be > 0

**Notes:**

* Sends ETH back to client
* Updates `status` to `REFUNDED`
* Emits `FundsRefunded` event

---

## Events

| Event                                            | Description                                   |
| ------------------------------------------------ | --------------------------------------------- |
| `JobCreated(address freelancer, uint amount)`    | Emitted when contract is funded               |
| `FundingConfirmed(address client)`               | Emitted when funding is confirmed             |
| `MilestoneApproved(address client)`              | Emitted when milestone is approved            |
| `FundsReleased(address freelancer, uint amount)` | Emitted when funds are released to freelancer |
| `FundsRefunded(address client, uint amount)`     | Emitted when client receives refund           |


---

## Important Notes

1. **Client Only**: All functions are restricted to client (the deployer).
2. **Status Flow**:
   `CONTRACT_FUNDED` → `FUNDING_CONFIRMED` → `MILESTONE_APPROVED` → `COMPLETED` or `REFUNDED`
3. **Funds Safety**: ETH is only sent after approval or refund.
4. **Refund Protection**: Refund can only occur before milestone approval.

---

## Error Messages

| Message                        | Meaning                                     |
| ------------------------------ | ------------------------------------------- |
| "Only client allowed"          | Function restricted to client               |
| "Must send ETH"                | No ETH sent to fund contract                |
| "Already funded"               | Contract already funded                     |
| "Contract not funded yet"      | Funding not confirmed yet                   |
| "Funding not confirmed yet"    | Milestone cannot be approved yet            |
| "Cannot refund after approval" | Refund not allowed after milestone approval |
| "No funds to refund"           | No ETH to refund                            |
| "Milestone not approved yet"   | Cannot release funds before approval        |
| "No funds to release"          | No ETH to release                           |
| "Transfer failed"              | ETH transfer failed                         |

---

## License

MIT

---
