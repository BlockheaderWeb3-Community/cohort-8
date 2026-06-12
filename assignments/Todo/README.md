# ✅ TodoList

> A decentralized todo list application built on Ethereum — create, complete, and manage tasks entirely on-chain.

---

## Overview

TodoList is a simple smart contract project that demonstrates on-chain task management. Users can add todo items, mark them as complete, and query their task list directly from the blockchain. Built with Hardhat 3 and deployed on Ethereum, it serves as a clean reference project for learning Solidity state management, event emission, and contract interaction patterns.

---

## Tech Stack

- [Hardhat 3](https://hardhat.org/) — Development environment and task runner
- [Solidity](https://soliditylang.org/) — Smart contract language
- [Ethers.js v6](https://docs.ethers.org/v6/) — Ethereum library
- [TypeScript](https://www.typescriptlang.org/) — Typed scripting

---

## Folder Structure

```
.
├── contracts/                  # Solidity source files
│   ├── TodoList.sol            # Core todo list contract
│
│
│
├── ignition/                   # Hardhat Ignition deployment modules
│   └── modules/
│       └── TodoList.ts         # Deployment module definitions
│
├── test/                       # Test suite
│   ├── unit/                   # Unit tests (TodoList.test.ts)
│   └── integration/            # End-to-end and fork tests
│
├── scripts/                    # Standalone utility scripts
│
├── deployments/                # Auto-generated deployment artifacts
│   └── <network>/
│       └── deployed_addresses.json
│
├── typechain-types/            # Auto-generated TypeScript typings
│
├── hardhat.config.ts           # Hardhat configuration
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js `>= 20.x`
- npm or pnpm

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Run Tests with Gas Report

```bash
REPORT_GAS=true npx hardhat test
```

---

## Deployment

Deployments are managed via [Hardhat Ignition](https://hardhat.org/ignition/docs/getting-started).

### Deploy to a Network

```bash
npx hardhat ignition deploy ignition/modules/TodoList.ts --network <network-name>
```

### Supported Networks

| Network          | Chain ID |
| ---------------- | -------- |
| Ethereum Mainnet | 1        |
| Sepolia Testnet  | 11155111 |
| Localhost        | 31337    |

---

## Deployed Contracts

> ✅ All contracts are **verified on Etherscan**.

### Ethereum Mainnet

| Contract   | Address                     | Etherscan                                                                   |
| ---------- | --------------------------- | --------------------------------------------------------------------------- |
| `TodoList` | `0xYourContractAddressHere` | [View on Etherscan](https://etherscan.io/address/0xYourContractAddressHere) |

### Sepolia Testnet

| Contract   | Address                                    | Etherscan                                                                                                        |
| ---------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `TodoList` | 0xaAee9Be4E1F57cde21976adacF502D2349054506 | [View on Etherscan] (https://eth-sepolia.blockscout.com/address/0xaAee9Be4E1F57cde21976adacF502D2349054506#code) |
|            |

---

## Contract Verification

Contracts are verified using Hardhat's built-in Etherscan verification. To manually verify a contract run:

```bash
npx hardhat verify --network <network-name> <deployed-address>
```

Ensure your `hardhat.config.ts` includes a valid `ETHERSCAN_API_KEY` set via your `.env` file.

---

## Environment Variables

Create a `.env` file in the root of the project and populate it with the following:

```env
# RPC URLs
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Deployer wallet
PRIVATE_KEY=your_private_key_here

# Etherscan verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

> ⚠️ Never commit your `.env` file. It is included in `.gitignore` by default.

---

## License

This project is licensed under the [MIT License](LICENSE).
