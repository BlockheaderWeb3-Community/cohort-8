# Foundry
A Comprehensive Guide to Forge and Cast


## Introduction
Foundry is a blazing fast, portable, and modular toolkit for Ethereum application development written in Rust. It is designed for smart contract developers who want speed, flexibility, and powerful command line tools.

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

[Foundry Documentation](https://book.getfoundry.sh/)

This document focuses on Forge and Cast, while also explaining how they fit into the complete Foundry ecosystem.
---

## What is Forge 
Forge is the core development tool in Foundry. It allows developers to build, test, debug, deploy, and verify smart contracts. Forge replaces the need for large JavaScript based frameworks and provides a clean and fast workflow written in Rust.

With Forge, you can:
- Build smart contracts
- Run automated tests
- Format Solidity code
- Measure gas usage
- Deploy contracts
- Manage dependencies

Forge works directly from the command line and uses a project structure similar to other Ethereum development tools.

---

## Installing and Using Forge

Once Foundry is installed, Forge commands are available in your terminal.

### Build Contracts

To compile your smart contracts, run:

```shell 
$ forge build
```

This command compiles all contracts in the src directory and checks for errors.
---


### Run Tests

Testing is one of the most powerful features of Forge.

```shell 
$ forge test
```
Forge supports Solidity based testing. Tests are fast and can include fuzz testing for more advanced coverage.
---

### Format Code

To format Solidity files automatically:

```shell 
$ forge fmt
```
This ensures consistent code style across your project.
---

### Format Code

To measure and track gas usage:

```shell 
$ forge snapshot
```
This helps developers optimize smart contracts and compare gas costs between versions.
---

### Deploy Contracts

You can deploy contracts using Forge scripts:

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

This command runs a deployment script using a specified RPC URL and private key.
---


### Help Command

For help with Forge:
```shell 
$ forge --help
```
---



## What is Cast

Cast is a command line tool for interacting with Ethereum smart contracts and blockchain data. It acts like a Swiss army knife for Ethereum development.

With Cast, you can:

- Call contract functions
- Send transactions
- Read blockchain data
- Convert between data formats
- Query balances
- Interact with deployed contracts

Cast is especially useful for debugging, scripting, and interacting with live networks.
---

### Using Cast

Basic usage:

```shell 
$ cast <subcommand>
```

To see all available options:

```shell 
$ cast --help
```

Cast can be used to:

- Query an address balance
- Call a contract function
- Send a signed transaction
- Convert between hex and decimal
- Check block information

It works with any Ethereum compatible network by providing an RPC URL.
---

## Anvil

Anvil is a local Ethereum node for development and testing.

It allows you to:

- Run a local blockchain
- Fork mainnet for testing
- Create test accounts with pre funded balances
- Simulate transactions

Start Anvil with:

```shell 
$ anvil
```
```shell 
For help:
```

```shell 
$ anvil --help
```

Anvil integrates seamlessly with Forge and Cast, making local testing simple and fast.

---


## Chisel

Chisel is a Solidity REPL that allows rapid prototyping. It lets developers experiment with Solidity code directly in the terminal without deploying contracts.
---

## Remappings

Remappings allow you to customize import paths in Solidity projects. They are configured in the foundry.toml file.

Example configuration:

```foundry.toml 
[profile.default]
remappings = [
  "@openzeppelin/=lib/openzeppelin-contracts/",
]
```


This allows you to import OpenZeppelin contracts using clean import paths instead of long relative paths.
---


## Soldeer

Soldeer is a Solidity native package manager included with Foundry. It provides an alternative to git submodules and offers versioned dependencies with simpler management.

Soldeer features:

- Versioned dependencies
- Package registry support
- Automatic remapping generation

### Initialize Soldeer

```solidity 
$ forge soldeer init
```

This creates a `soldeer.toml` configuration file.

Example configuration:

```solidity 
[soldeer]
remappings_generate = true
remappings_regenerate = false
remappings_version = true
remappings_prefix = "@"
remappings_location = "config"

[dependencies]
"@openzeppelin-contracts" = "5.0.0"
"@solmate" = "6.7.0"
```

This setup allows your project to use specific versions of external Solidity libraries in a clean and organized way.

---

## Complete Foundry Tool Overview

forge
Build, test, debug, deploy, and verify smart contracts

cast
Interact with contracts, send transactions, and query blockchain data

anvil
Run a local Ethereum node with forking support

chisel
Solidity REPL for rapid experimentation

---

## Why Use Foundry

- Foundry is fast because it is written in Rust
- It has minimal dependencies
- It provides native Solidity testing
- It integrates local and live network workflows
- It simplifies dependency management
- It offers powerful command line tooling

Forge and Cast together provide a complete smart contract development and interaction workflow.

- Forge handles building and testing.
- Cast handles communication with deployed contracts.
- Anvil provides a local blockchain.
- Chisel allows quick experimentation.

---

## Conclusion

Foundry is a modern toolkit for Ethereum smart contract development. Forge allows developers to build, test, and deploy contracts efficiently. Cast enables powerful interaction with blockchain networks. Combined with Anvil and Chisel, Foundry provides a complete, high performance development environment.

With its speed, simplicity, and modular design, Foundry is an excellent choice for Ethereum developers who want full control over their workflow.

This document covered all core commands, tools, configuration options, and package management features necessary to understand and use Forge and Cast effectively.









## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help


# Foundry


##
`forge`: Build, test, debug, deploy, and verify smart contracts
`cast`: Interact with contracts, send transactions, and query chain data
`anvil`:	Run a local Ethereum node with forking capabilities	Reference
`chisel`:	Solidity REPL for rapid prototyping

### Remappings
Customize import paths with remappings in `foundry.toml`:

```foundry.toml
[profile.default]
remappings = [
  "@openzeppelin/=lib/openzeppelin-contracts/",
]
```

### Soldeer
Soldeer is a Solidity-native package manager that provides an alternative to git submodules. It offers versioned dependencies, a package registry, and simpler dependency management.

#### Installation
Soldeer comes bundled with Foundry. Initialize it in your project:

```solidity
$ forge soldeer init
```
This creates a `soldeer.toml` configuration file.

```solidity
[soldeer]
remappings_generate = true
remappings_regenerate = false
remappings_version = true
remappings_prefix = "@"
remappings_location = "config"

[dependencies]
"@openzeppelin-contracts" = "5.0.0"
"@solmate" = "6.7.0"
```

```
