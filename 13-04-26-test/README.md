## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

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
```
/**
 * @title Attacker
 * @notice Exploits the reentrancy vulnerability in VulnerableVault.
 *
 * The bug: VulnerableVault.withdraw() sends ETH *before* updating balances[msg.sender].
 * Combined with unchecked subtraction (mirroring pre-0.8 Solidity), this allows
 * draining the entire vault with a minimal deposit.
 *
 * Attack flow (deposit = 1 ETH, vault has 8 ETH from victims):
 *  1. Attacker deposits 1 ETH  → balances[attacker] = 1 ETH
 *  2. Calls withdraw(1 ETH)
 *  3. Vault sends 1 ETH → triggers receive()
 *  4. receive() calls withdraw(1 ETH) again — balance check still passes (state not updated)
 *  5. Repeat until vault is empty (9 total calls: 1 deposit + 8 victim ETH)
 *  6. On unwind, each frame does: balances[attacker] -= 1 ETH (unchecked)
 *     - Frame 9 unwind: 1 - 1 = 0
 *     - Frame 8 unwind: 0 - 1 = type(uint256).max  (wraps, but vault is already drained)
 *     - Frames 7..1: keep wrapping — no ETH left to steal anyway
 *
 * Net result: attacker spent 1 ETH, received 9 ETH → profit = 8 ETH (all victim funds).
 */