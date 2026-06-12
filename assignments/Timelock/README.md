## TimeLock Smart Contract

A simple on-chain time-locked vault system that allows users to deposit ETH and lock it until a chosen future timestamp. Each user can create multiple independent vaults with different unlock times.
This contract is useful for:

1. Personal savings locks
2. Vesting simulations
3. Delayed payments
4. Self-custody time-based funds management

### Overview

The TimeLock contract lets users:
Deposit ETH into time-locked vaults
Withdraw funds only after unlock time
Manage multiple vaults per address
Withdraw all unlocked vaults at once
View vault balances and statuses
Each deposit creates a new vault tied to the sender.

contract address: 0x9566b30F3B5177596A729544Ca127474baa3692C

(etherscan_link)[https://eth-sepolia.blockscout.com/address/0x9566b30F3B5177596A729544Ca127474baa3692C]
