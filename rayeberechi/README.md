# Timelocked Savings Vault

A smart contract system that forces users to save ETH until a specific date.

## Features
- **Time Lock**: Users set an `unlockTime`. Funds cannot be withdrawn before this timestamp.
- **Factory Pattern**: Each user gets their own personal Vault contract.
- **Single Active Vault**: A user cannot create a second vault if they already have funds locked in an existing one.
- **Security**: 
  - Only the owner can withdraw.
  - Direct ETH transfers to the vault are rejected (no `receive` function).
  - Full balance is withdrawn at once to reset the vault.

## Usage
1. Call `createVault(unlockTime)` on the Factory with ETH attached.
2. Wait until `block.timestamp >= unlockTime`.
3. Call `withdraw()` on your specific Vault address.