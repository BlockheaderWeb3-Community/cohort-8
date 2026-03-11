# Ethereum Gas Fee and Merkle Root Calculator


## Overview
This repo contains:
- Simple explanations and calculation of key concepts around gas.
-  TypeScript scripts for computing the Merkle roots of transactions using SHA256 and Keccak256.

## Gas Fees in Ethereum: Explanation and Formula

In Ethereum (and other EVM-based blockchains), gas is a unit that measures the computational work required to execute a transaction or smart contract.
It prevents spam and ensures fair use of network resources.

**Gas fees** are the cost paid for this computation and are paid in ETH (or the chain’s native token).
I'll like to explain some concepts that are closesly associated with gas.

### Key Concepts 
- **Gas Limit**: This is the maximum amount of gas a transaction is allowed to use/consume, usually set by the user when submitting the transaction. If the transaction exceeds the limit in for a transaction, it fails and the gas is used. It is set by the user or wallet. If execution requires more gas than the limit, the transaction fails and is not refunded. 
- **Gas Price (Gwei)**: This is the price/unit (Gwei, where 1 Gwei = 10^-9 ETH) of gas that the user bids. Miners will usually prefer a higher gas price.
The price per unit of gas, denominated in Gwei

1 Gwei = 10⁻⁹ ETH
- **Gas Used**: The actual amount of gas consumed by the transaction after it has been executed. Simple ETH transfers use a fixed amount. Smart contracts consume variable gas depending on logic.

- **Base Fee**: This fee is dynamically adjusted by the protocol depending on how the network is congested. It would watch for the block to be ~50%. This fee is burned, and ETH suply is reduced. Dynamically adjusted by the protocol based on network congestion. Target block usage is ~50%. Burned (removed from circulation), reducing ETH supply.
- **Priority Fee (Tip)**: An optional extra fee to incentivize miners/validators to include your transaction faster.
Optional extra fee paid to validators. Incentivizes faster inclusion in a block.
- **Effective Gas Price**: The total price per gas unit paid = Base Fee + Priority Fee.

### Gas Fee Formula
**Total Gas Fee = Gas Used x Effective Gas Price** 


#### Example Calculation

If you send **2 ETH** and the transaction uses 4 units of gas, with:

Base Fee = 11 Gwei

Priority Fee = 3 Gwei

Total Fee = 4 × (11 + 3)
          = 4 × 14
          = 56 Gwei


Convert to ETH:

56 Gwei = 56 × 10⁻⁹ ETH
        = 0.000000056 ETH


**Total sent:**
2.000000056 ETH

### What Affects Gas Fees?

- **Network congestion:** Higher demand → higher base fee
- **Transaction complexity:** More computation → more gas used
- **User tip:** Higher priority fee → faster confirmation

Gas fees are **market-driven**, not fixed.


## Markle Root (Root Hash)
This is a cryptographic hash that serves as a unique fingerprint for all transactions within a blockchain block. It is the final code in a markle tree.


### Setup
run
```bash
  git clone https://github.com/Olorunshogo/blockheader-web3-assignments.git
  cd gas-hash
  npm install
  node hash.ts
```

## Merkle Root
- Prompts for tx count and strings, derives hashes, computes roots with both algorithms.
- Leaves are 64-char hex (32 bytes).

## Notes
- Tested on Node.js 24.11.1.