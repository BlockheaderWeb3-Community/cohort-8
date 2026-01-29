# Ethereum JSON-RPC API - Quick Overview

This document lists **all important JSON-RPC methods** used to talk to an Ethereum node.

Ethereum has two main parts after The Merge (2022):

- **Execution client** (Geth, Erigon, Nethermind, Besu, Reth...) -> handles transactions, smart contracts, EVM
- **Consensus client** (Prysm, Lighthouse, Teku, Nimbus, Lodestar...) -> handles proof-of-stake, validators, Beacon Chain

Most people use the **Execution client JSON-RPC** (port 8545 by default) when they build dApps, wallets or scripts.  
This page mainly covers **Execution client methods**.

> Note: Consensus client has its own API called **Beacon API** (usually port 5052).  
> There is also the **Engine API** (between execution ↔ consensus client), but normal developers almost never use it directly.

## Main JSON-RPC Categories

### 1. Web3 / Net / Client Info
Methods to check node version, network, connection status

- web3_clientVersion  
- web3_sha3  
- net_version  
- net_listening  
- net_peerCount  
- eth_protocolVersion (not always supported)  
- eth_chainId  
- eth_syncing  
- eth_mining (only PoW networks)  
- eth_hashrate (only PoW networks)  
- eth_gasPrice  
- eth_accounts (only if node manages keys)  
- eth_coinbase (deprecated)

### 2. Block & Chain Head
Methods to know current block and chain status

- eth_blockNumber  
- eth_getBlockByHash  
- eth_getBlockByNumber  
- eth_getBlockTransactionCountByHash  
- eth_getBlockTransactionCountByNumber  
- eth_getUncleCountByBlockHash  
- eth_getUncleCountByBlockNumber

### 3. Account & Balance
Check balances, nonce, code, storage

- eth_getBalance  
- eth_getTransactionCount  
- eth_getCode  
- eth_getStorageAt

### 4. Transaction Sending
Send / sign transactions

- eth_sendTransaction  
- eth_sendRawTransaction  
- eth_sign (dangerous – only for testing)  
- eth_signTransaction (signs but does not send)

### 5. Call & Gas Estimation
Read smart contracts without changing state

- eth_call  
- eth_estimateGas

### 6. Transaction & Receipt Info
Get details about past transactions

- eth_getTransactionByHash  
- eth_getTransactionByBlockHashAndIndex  
- eth_getTransactionByBlockNumberAndIndex  
- eth_getTransactionReceipt

### 7. Uncle Blocks (only relevant on old PoW chains)

- eth_getUncleByBlockHashAndIndex  
- eth_getUncleByBlockNumberAndIndex

### 8. Logs / Events (Filter system)

- eth_newFilter  
- eth_newBlockFilter  
- eth_newPendingTransactionFilter  
- eth_uninstallFilter  
- eth_getFilterChanges  
- eth_getFilterLogs  
- eth_getLogs

## Quick Summary Table – Most Used Methods

| Group                  | Very Common Methods                              | Less Common / Advanced                          |
|------------------------|--------------------------------------------------|-------------------------------------------------|
| Node info              | eth_chainId, net_version, eth_syncing            | web3_clientVersion, net_peerCount               |
| Current state          | eth_blockNumber, eth_getBalance, eth_getCode     | eth_getStorageAt                                |
| Read contracts         | eth_call, eth_estimateGas                        | —                                               |
| Send transactions      | eth_sendRawTransaction                           | eth_sendTransaction, eth_sign                   |
| Transaction lookup     | eth_getTransactionReceipt, eth_getTransactionByHash | eth_getTransactionByBlock...                   |
| Logs / Events          | eth_getLogs                                      | eth_newFilter + eth_getFilterChanges            |
| Blocks                 | eth_getBlockByNumber, eth_getBlockByHash         | eth_getUncle...                                 |

## Useful Tips

- Always use `"latest"`, `"pending"`, `"safe"`, or `"finalized"` as block tag when possible (safer than raw block numbers)
- `eth_call` and `eth_estimateGas` do **not** cost gas and do **not** change the blockchain
- `eth_sendRawTransaction` is the safest way to send already-signed transactions
- `eth_getLogs` is very powerful but can be slow on big ranges — use filters when you can

Good starting point for most projects:

```text
eth_chainId
eth_blockNumber
eth_getBalance
eth_call
eth_estimateGas
eth_sendRawTransaction
eth_getTransactionReceipt
eth_getLogs
```