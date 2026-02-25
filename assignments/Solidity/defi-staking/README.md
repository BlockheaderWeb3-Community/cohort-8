# DeFi Staking Platform

A decentralized staking platform built with Solidity and Hardhat. Users can stake tokens to earn rewards over time, with configurable lock periods and early withdrawal penalties.

## Project Overview

This is a DeFi staking application that allows users to stake tokens and earn rewards. The platform features:

- **Yield Farming**: Stake tokens to earn reward tokens over time
- **Lock Periods**: Configurable staking lock periods to encourage long-term participation
- **Early Withdrawal Penalties**: Penalty system for early unstaking
- **Multi-Pool Support**: Multiple staking pools can be created with different configurations
- **Emergency Withdrawals**: Safety mechanism for edge cases
- **Reward Rate Management**: Adjustable reward rates by the protocol owner

## Smart Contracts

### Core Contracts

| Contract | Description |
|----------|-------------|
| [`StakingPool.sol`](contracts/StakingPool.sol) | Main staking pool contract with all core logic |
| [`StakingToken.sol`](contracts/token/StakingToken.sol) | ERC20 token for staking (mock token) |
| [`RewardToken.sol`](contracts/token/RewardToken.sol) | ERC20 token for rewards (mock token) |
| [`ERC20.sol`](contracts/token/ERC20.sol) | Custom ERC20 implementation |

### Key Features of StakingPool

- **Stake**: Users can stake tokens and earn rewards based on duration
- **Withdraw**: Withdraw staked tokens (with penalty if before lock period ends)
- **Claim Rewards**: Claim accumulated rewards without unstaking
- **Exit**: Withdraw stake and claim rewards in one transaction
- **Emergency Withdraw**: Withdraw without rewards in emergency situations

### Admin Functions

- `setRewardRate`: Update the reward rate
- `setLockPeriod`: Change the lock period duration
- `setPenalty`: Adjust early withdrawal penalty
- `setEmergencyWithdrawEnabled`: Toggle emergency withdrawal
- `fundRewards`: Deposit reward tokens into the pool

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

Run all tests:
```bash
npx hardhat test
```

Run only Solidity tests (Foundry):
```bash
npx hardhat test solidity
```

Run only TypeScript tests (Mocha):
```bash
npx hardhat test mocha
```

## Contract Configuration

### Constructor Parameters

The `StakingPool` contract is initialized with:
- `_stakingToken`: Address of the token users will stake
- `_rewardToken`: Address of the token used for rewards
- `_rewardRate`: Rewards per second per token (scaled by 1e18)
- `_poolId`: Unique identifier for this pool

### Default Values

- **Lock Period**: 7 days
- **Early Withdrawal Penalty**: 10% (1000 basis points)

## Usage Example

### Deploying the Contracts

1. Deploy `StakingToken` (e.g., "Staking Token", "STK")
2. Deploy `RewardToken` (e.g., "Reward Token", "RWD")
3. Deploy `StakingPool` with the token addresses and desired reward rate
4. Fund the `StakingPool` with reward tokens using `fundRewards()`

### User Interactions

```solidity
// Approve tokens
stakingToken.approve(stakingPoolAddress, amount);

// Stake tokens
stakingPool.stake(amount);

// Check pending rewards
uint256 pending = stakingPool.pendingRewards(userAddress);

// Claim rewards
stakingPool.claimRewards();

// Withdraw (with penalty if early)
stakingPool.withdraw(amount);

// Exit (withdraw + claim)
stakingPool.exit();
```

## Security Features

- **Reentrancy Protection**: All state-modifying functions use `nonReentrant` modifier
- **Access Control**: Admin functions restricted to `onlyOwner`
- **Safe ERC20**: Uses SafeERC20 for token transfers
- **Pausable**: Emergency withdrawal mechanism for edge cases

## Development

### Tech Stack

- **Solidity**: ^0.8.20
- **Hardhat**: ^3.1.9
- **Ethers.js**: ^6.16.0
- **Foundry**: For Solidity unit tests
- **Mocha**: For TypeScript integration tests

### Project Structure

```
defi-staking/
├── contracts/
│   ├── StakingPool.sol          # Main staking contract
│   └── token/
│       ├── ERC20.sol             # ERC20 implementation
│       ├── StakingToken.sol      # Staking token
│       ├── RewardToken.sol       # Reward token
│       └── SafeERC20.sol         # SafeERC20 wrapper
├── test/                        # TypeScript tests
├── scripts/                     # Deployment scripts
├── ignition/modules/            # Hardhat Ignition modules
└── hardhat.config.ts           # Hardhat configuration
```

## License

MIT
