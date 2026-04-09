# TimelockedVault Smart Contract

A Solidity smart contract that allows users to deposit ETH into a vault with a time lock. Users can only withdraw their funds after a specified unlock time.

---

## Overview

This contract allows users to:

* Deposit ETH into a personal vault with a specified unlock time
* Withdraw ETH only after the unlock time has passed
* Ensure each user can only have one active vault at a time

---

## Contract Details

* **License**: MIT
* **Solidity Version**: ^0.8.28

---

## State Variables

| Variable | Type                      | Description                          |
| -------- | ------------------------- | ------------------------------------ |
| `vaults` | mapping(address => Vault) | Stores each user's vault information |

### Vault Struct

| Variable     | Type | Description                              |
| ------------ | ---- | ---------------------------------------- |
| `amount`     | uint | Amount of ETH deposited in wei           |
| `unlockTime` | uint | Timestamp when funds become withdrawable |
| `active`     | bool | Whether the vault is active              |

---

## Functions

### deposit(uint _unlockTime)

Deposits ETH into the user's vault with a time lock.

**Access:** Public

**Requirements:**

* ETH must be greater than 0
* `_unlockTime` must be in the future and within 365 days from now
* User must not already have an active vault

**Notes:**

* Creates a new vault for the user
* Emits `Deposited` event

---

### withdraw()

Withdraws ETH from the vault after unlock time.

**Access:** Public

**Requirements:**

* User must have an active vault
* Current timestamp must be >= `unlockTime`
* Vault amount must be greater than 0

**Notes:**

* Sends all ETH from the vault to the user
* Marks vault as inactive
* Emits `Withdrawn` event

---

## Events

| Event                                                   | Description                                     |
| ------------------------------------------------------- | ----------------------------------------------- |
| `Deposited(address user, uint amount, uint unlockTime)` | Emitted when a user deposits ETH into the vault |
| `Withdrawn(address user, uint amount)`                  | Emitted when a user withdraws funds             |

---

## Important Notes

1. **One Active Vault**: Each user can only have one active vault at a time.
2. **Time Restriction**: Unlock time must be in the future and within 365 days.
3. **Funds Safety**: ETH is held in contract until unlock time.
4. **ETH Transfers**: Uses `.call()` for safe ETH transfer.

---

## Error Messages

| Message                | Meaning                                        |
| ---------------------- | ---------------------------------------------- |
| "Must send ETH"        | User tried to deposit 0 ETH                    |
| "Invalid unlock time"  | Unlock time is in the past or exceeds 365 days |
| "Vault already active" | User already has an active vault               |
| "No active vault"      | User tried to withdraw without an active vault |
| "Funds are locked"     | Unlock time has not passed yet                 |
| "No funds"             | Vault contains 0 ETH                           |
| "Transfer failed"      | ETH transfer failed                            |

---

## License

MIT

---
