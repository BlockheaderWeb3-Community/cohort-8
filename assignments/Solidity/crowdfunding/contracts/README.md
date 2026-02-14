# Crowdfunding Smart Contract

A Solidity smart contract for managing ETH-based crowdfunding campaigns with goal-based funding and refund capabilities.

## Overview

This contract enables creators to set up crowdfunding campaigns where:
- A goal amount in ETH must be reached within a specified deadline
- Contributors can pledge ETH toward the goal
- If the goal is met, the owner can withdraw the funds
- If the goal is not met by the deadline, contributors can claim refunds

## Contract Details

- **License**: MIT
- **Solidity Version**: ^0.8.26

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `owner` | address | The campaign creator/owner |
| `goalAmount` | uint | The funding target in wei (1 ETH = 10^18 wei) |
| `contributedAmount` | uint | Total amount contributed |
| `deadline` | uint | Campaign end timestamp |
| `haveSetGoal` | bool | Whether the goal has been set |
| `takenRefund` | bool | Whether refunds have been claimed |
| `withdrawn` | bool | Whether funds have been withdrawn |
| `contributors` | mapping | Tracks contribution amounts per address |

## Functions

### constructor(address _owner)
Initializes the contract with the campaign owner.

**Parameters:**
- `_owner`: Address of the campaign creator

**Access:** Anyone

---

### setGoal(uint256 _goal, uint256 __deadline)
Sets the crowdfunding goal and deadline. Can only be called once by the owner.

**Parameters:**
- `_goal`: Target amount in ETH (will be converted to wei)
- `__deadline`: Duration in seconds from now until campaign ends

**Access:** Owner only

**Requirements:**
- Caller must be the owner
- Goal must not have been set already

**Notes:**
- The deadline is calculated as `block.timestamp + __deadline`
- The goal amount is converted to wei (multiplied by 1 ether)

---

### contribute()
Allows users to contribute ETH to the campaign.

**Access:** Anyone except owner

**Requirements:**
- Caller cannot be the owner
- Contribution must be greater than 0 ETH
- Goal must not have been met yet

**Notes:**
- Contributions are tracked per address in the `contributors` mapping
- Multiple contributions from the same address are accumulated

---

### withdraw()
Allows the owner to withdraw funds if the goal was met.

**Access:** Owner only

**Requirements:**
- Caller must be the owner
- Funds must not have been withdrawn already
- Goal amount must be reached
- Deadline must have passed

**Notes:**
- Transfers all contract balance to the owner
- Sets `withdrawn` to true after successful withdrawal

---

### refund()
Allows contributors to claim refunds if the goal was not met.

**Access:** Contributors only

**Requirements:**
- Caller cannot be the owner
- Refund must not have been claimed already
- Goal amount must NOT be reached
- Deadline must have passed

**Notes:**
- Returns the contributor's total contributed amount
- Sets `takenRefund` to true after successful refund

## Usage Example

### Deploying the Contract
```javascript
const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
const crowdfunding = await Crowdfunding.deploy(ownerAddress);
await crowdfunding.deployed();
```

### Setting a Goal
```javascript
// Goal: 10 ETH, Duration: 7 days (604800 seconds)
await crowdfunding.setGoal(10, 604800);
```

### Contributing
```javascript
// Contribute 1 ETH
await crowdfunding.contribute({ value: ethers.utils.parseEther("1") });
```

### Withdrawing Funds (Owner - after successful campaign)
```javascript
await crowdfunding.withdraw();
```

### Requesting Refund (Contributor - after failed campaign)
```javascript
await crowdfunding.refund();
```

## Important Notes

1. **Owner Restrictions**: The campaign owner cannot contribute to their own campaign to prevent manipulation.

2. **One-time Actions**: 
   - Goal can only be set once
   - Withdraw and refund can only be executed once

3. **Refund Calculation**: Refunds return the contributor's original contribution amount (converted from ETH to wei), not including any potential changes in value.

4. **Security Considerations**:
   - No reentrancy guard on withdraw/refund functions
   - Uses `.call()` for Ether transfers which is recommended for Solidity 0.8+
   - No pause mechanism exists

## Error Messages

- `"Owner must call function"` - Function restricted to owner
- `"Owner can't contribute"` - Owner attempted to contribute
- `"ETH must be greater than zero"` - Zero value contribution attempted
- `"Goal is met"` - Attempted contribution when goal already reached
- `"Already set goal"` - Attempted to set goal twice
- `"Already withdrawn"` - Attempted to withdraw twice
- `"Haven't reached deadline"` - Conditions for withdrawal not met
- `"Alredy taken refund"` - Attempted to claim refund twice
- `"Conditions aren't met yet"` - Conditions for refund not met
- `"transcation failed"` / `"transaction failed"` - Transfer operation failed
