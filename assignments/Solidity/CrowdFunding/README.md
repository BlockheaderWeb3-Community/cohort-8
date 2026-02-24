# Simple CrowdFunding Smart Contract

## Description

This is a simple crowdfunding smart contract written in Solidity.

It allows people to send ETH to support a project. The project has a **goal** and a **deadline**.

* If the goal is reached → the owner can withdraw the funds
* If the goal is not reached → contributors can get a refund

---

## How it Works

### 1. Deployment

When the contract is deployed, the deployer provides:

* Funding goal (in wei)
* Campaign duration (in days)

The deployer becomes the **owner**.

---

### 2. Funding

Users can send ETH using the `fund()` function.

Conditions:

* Campaign must not have ended
* Goal must not already be reached
* ETH must be greater than 0

The contract stores how much each user contributed.

---

### 3. Withdraw (Owner only)

The owner can withdraw funds if:

* Goal is reached
* Deadline has passed
* Funds have not already been withdrawn

---

### 4. Refund

Contributors can refund their ETH if:

* Deadline has passed
* Goal was NOT reached

---

## Functions

### fund()

Send ETH to support the campaign.

---

### withdraw()

Owner withdraws ETH after successful campaign.

---

### refund()

Contributors get their ETH back if campaign fails.

---

## Events

The contract emits events when:

* Someone funds → `Funded`
* Owner withdraws → `Withdrawn`
* Someone refunds → `Refunded`

---

## Example

Goal: 10 ETH
Duration: 30 days

If users send 10 ETH before 30 days → owner withdraws

If users send less than 10 ETH → users refund

---

## License

MIT
