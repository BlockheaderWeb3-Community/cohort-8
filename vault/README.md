TimelockedVault Smart Contract

A simple smart contract written in Solidity (^0.8.28) that lets users lock their ETH until a specific time.

Users deposit ETH and can only withdraw it after the unlock time.

How It Works
1️⃣ Deposit

Call deposit() and:

Send ETH

Set a future unlock time

Rules:

You can only have one active vault at a time

Unlock time must be in the future

Must send ETH

Your ETH is locked until the unlock time.

2️⃣ Withdraw

Call withdraw() after the unlock time.

Rules:

You must have an active vault

Current time must be past the unlock time

Once withdrawn:

Your vault resets

You can create a new one

Main Functions

deposit(uint256 _unlockTime) → Lock ETH until a future time

withdraw() → Withdraw ETH after unlock time

Use Cases

Personal savings lock

Time-based investment holding

Delayed withdrawals

Learning time-lock logic in Solidity