# Foundry – Getting Started

## Overview

Foundry is a toolkit for building, testing, and deploying Ethereum smart contracts. It works from the command line and is known for being fast and simple to use.

It helps me:

* Write smart contracts
* Compile them
* Run tests
* Deploy contracts
* Interact with the blockchain
* Run a local Ethereum network

---

# Tools Included in Foundry

Foundry comes with four main tools:

## Forge

Used to:

* Build smart contracts
* Run tests
* Deploy contracts
* Manage projects

## Cast

Used to:

* Send transactions
* Call smart contract functions
* Check balances
* Read blockchain data

## Anvil

Used to:

* Run a local Ethereum blockchain
* Test deployments locally
* Work with pre-funded test accounts

## Chisel

Used to:

* Test small Solidity snippets quickly
* Experiment with Solidity code

---

# Installation

To install Foundry:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

After installation, the following commands become available:

* `forge`
* `cast`
* `anvil`
* `chisel`

---

# Creating a New Project

To create a new Foundry project:

```bash
forge init my_project
cd my_project
```

This creates a project structure like this:

```
my_project/
│
├── src/        → Smart contracts
├── test/       → Test files
├── script/     → Deployment scripts
└── foundry.toml → Configuration file
```

---

# Building Contracts

To compile smart contracts:

```bash
forge build
```

This checks for errors and compiles the contracts.

---

# Running Tests

To run tests:

```bash
forge test
```

This command:

* Runs all test files
* Shows which tests passed
* Shows which tests failed
* Displays gas usage

---

#  Deploying Contracts

Contracts can be deployed using scripts:

```bash
forge script script/Example.s.sol
```

To deploy to a real network, I need:

* A private key
* An RPC URL

---

#  Running a Local Blockchain

To start a local Ethereum network:

```bash
anvil
```

This:

* Creates test accounts
* Gives them fake ETH
* Allows local testing of deployments and transactions

---

# Using Cast to Interact with Blockchain

Example: Check account balance

```bash
cast balance <address> --ether --rpc-url <rpc_url>
```

With `cast`, I can:

* Call contract functions
* Send transactions
* Check block information
* Read on-chain data

---

# Using Chisel

Start Chisel:

```bash
chisel
```

It allows testing small Solidity code instantly without creating a full contract.

Example:

uint x = 5;

# What I Learned

* How to install Foundry
* How to create a new project
* How to compile contracts
* How to run tests
* How to deploy contracts
* How to run a local blockchain
* How to interact with Ethereum from the command line
