# Transaction Vault (Timelock Savings Vault)

A Solidity smart contract that implements a timelock savings vault, allowing users to deposit ETH with a强制 lock period before withdrawal.

## Overview

The Transaction Vault is a simple but effective timelock savings contract that enables users to:
- Deposit ETH into a personal vault
- Set a mandatory lock period (1 hour)
- Withdraw all funds only after the lock period expires

## Contract Details

- **Language**: Solidity ^0.8.26
- **License**: MIT
- **Contract Name**: Timelock

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `user` | address | The owner of the vault who can deposit and withdraw |
| `userbalance` | mapping(address => uint) | Tracks the ETH balance for each user |
| `locktime` | mapping(address => uint) public | Public mapping showing when funds become available for withdrawal |

## Constructor

```solidity
constructor(address _user)
```

Initializes the vault with a designated user address.

**Parameters:**
- `_user`: The address that will own this vault and be able to deposit/withdraw

## Functions

### deposit()

```solidity
function deposit() public payable
```

Allows the user to deposit ETH into the vault.

**Requirements:**
- Caller must be the designated user
- Deposit amount must be greater than 0

**Behavior:**
- Adds the sent ETH to the user's balance
- Sets a lock time of 1 hour (3600 seconds) from the current block timestamp

### withdraw()

```solidity
function withdraw() public
```

Allows the user to withdraw all ETH from the vault after the lock period.

**Requirements:**
- Caller must be the designated user
- Current block timestamp must be >= the user's lock time

**Behavior:**
- Transfers all vault balance to the user
- Uses low-level `call` for ETH transfer

## Security Considerations

1. **Access Control**: Only the designated user can interact with the vault
2. **Timelock Enforcement**: Withdrawals are blocked until the 1-hour period expires
3. **Reentrancy Protection**: Uses checks-effects-interactions pattern implicitly through the require statements before transfer
4. **Failed Transfer Handling**: Requires successful ETH transfer

## Usage Example

```javascript
// Deploy the vault with a user address
const Timelock = await ethers.getContractFactory("Timelock");
const vault = await Timelock.deploy(userAddress);

// Deposit ETH (must be the designated user)
await vault.deposit({ value: ethers.parseEther("1.0") });

// Try to withdraw immediately (will fail - locktime not expired)
await vault.withdraw(); // Will revert with "Time's not up"

// Wait for lock period to pass (1 hour)
// Then withdraw
await vault.withdraw();
```

## Potential Improvements

1. **Configurable Lock Time**: Allow the user to set custom lock periods
2. **Multiple Deposits**: Support multiple deposits with individual lock times
3. **Partial Withdrawals**: Allow withdrawing only a portion of funds
4. **Events**: Add events for deposit and withdrawal for better tracking
5. **Interest**: Add interest-bearing functionality
6. **Emergency Withdrawal**: Add an admin emergency withdrawal mechanism

## Error Messages

| Error | Description |
|-------|-------------|
| `"Not your account"` | Caller is not the designated user (deposit) |
| `"Can't withdraw, not your account"` | Caller is not the designated user (withdraw) |
| `"Time's not up"` | Lock period has not yet expired |
| `"transcation failed"` | ETH transfer failed |
| `"ETH must be greater than zero"` | Deposit amount is zero |

## License

MIT
