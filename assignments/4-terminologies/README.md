## Exec hash, finalized root, epoch and block hash, slots, fork choice

### Block hash 
A block hash is a short fingerprint of a block.
It’s created by hashing the block’s contents (transactions, metadata, etc.)
Looks like random hex: 0x9f3a...
Why it matters:
If anything in the block changes → the hash changes
This makes blocks tamper-evident

### Execution hash (execution payload hash)
Ethereum has two layers now:
Execution layer → transactions, balances, smart contracts
Consensus layer → validators, slots, finality
Execution hash is:
A hash that represents the result of executing transactions in a block
It commits to:
- Account balances
- Contract storage
- Gas usage
- Logs, etc.
**Why it exists**:
Consensus layer needs to know “this is the exact execution result”
Prevents lying about transaction outcomes

### Finalized root:
A cryptographic commitment to Ethereum’s state that is locked in forever
When something is finalized:
It cannot be reverted
Even if validators disagree later
Ethereum finalizes blocks using validator votes (called finality).
Why it matters:
Exchanges wait for finalization before crediting deposits
Apps trust finalized data

### Epoch
🔹 Slot
Time unit: 12 seconds
Each slot can have one block

🔹 Epoch
32 slots = 1 epoch
About 6.4 minutes
**So**:
Slot → Block
32 Slots → 1 Epoch

🔹 Epoch purpose:
Group slots together
Validators vote during epochs
Finalization happens at epoch boundaries

### Fork choice
Ethereum is decentralized, so:
Sometimes two blocks appear at the same time
Network temporarily disagrees

**Fork choice rule answers**:
```
“Which chain should I follow?”
```
Ethereum uses a rule called `LMD-GHOST`:
Follow the chain with the most validator support
Heavier = more votes, not more computation

**Why fork choice exists:**
Keeps everyone converging on one canonical chain
Resolves temporary splits. You can say it's a rule for picking the “real” chain

**Think of it like this**
Multiple branches → pick the branch with more people standing on it

### How everything connects (big picture)
Time → Slots → Blocks → Epochs
             ↓
        Block Hash
             ↓
     Execution Hash
             ↓
       Finalized Root


Fork choice decides which blocks matter
Epochs organize validator voting
Finalized root locks history forever