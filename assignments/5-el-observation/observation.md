## Fork_choice
Fork choice is the rule Ethereum uses to decide which version of the blockchain is the “real” one when there are multiple possibilities.

Super simple version

Sometimes, different validators see blocks in a different order, so the chain briefly splits into multiple forks (like multiple conversation threads).

Fork choice = “Which fork should we follow?”

**How Ethereum decides (post-Merge)**

Ethereum uses a rule called LMD-GHOST(Latest Message Driven – Greediest Heaviest Observed SubTree) + finality:

- Validators vote on blocks by building on top of them

- The fork with the most validator support is chosen

- Once blocks are finalized, they can’t be changed anymore

*Validators also explicitly vote on checkpoints, When 2/3 of all staked ETH agrees on a checkpoint, that block is finalized, it can never be reverted unless validators burn massive amounts of ETH*

## Exec_hash

exec_hash is a fingerprint of what happened in the Ethereum execution layer for a block.


**After the Merge, Ethereum has two parts:**

- Consensus layer → decides which blocks are valid and in what order

- Execution layer → actually runs transactions (balances, smart contracts, gas, etc.)

They need a way to stay in sync.

### What exec_hash actually is

- It’s a cryptographic hash

*It summarizes:*

- all transactions

- state changes

- execution results for that block

So instead of re-sending everything, Ethereum just says:

“If you ran the transactions correctly, you should get this exact hash.”

Super simple analogy

Think of two coworkers:

One does the work (execution layer)

One checks the outcome (consensus layer)

exec_hash is the receipt number that proves:

“Yes, we both got the same result.”

If the receipt numbers don’t match → block is invalid ❌

Why exec_hash matters

Keeps consensus and execution locked together

Prevents cheating or mismatched transaction execution

Allows Ethereum’s split design to still behave like one chain

## Finalized_root

Finalized_root is the ID of the latest block that Ethereum has locked in forever.



**Ethereum regularly says:**

- “This block is done.”

- “It can never be changed.”

- That “done forever” block is called finalized.

## finalized_epoch


*finalized_epoch* is the number of the time period that Ethereum has locked in forever.


Ethereum time is grouped into epochs:

1 epoch = 32 slots (≈ 6.4 minutes)

Finality doesn’t happen per block — it happens per epoch.

---


What finalized_epoch means

It’s the latest epoch that validators have finalized

All blocks up to the end of that epoch are permanent

Anything after it is still “recent” and could change

So Ethereum is basically saying:

“Everything up to epoch X is final. No take-backs.”


## 1. Slot

**Slot = a fixed time window (12 seconds)**

* Every 12 seconds, Ethereum has a chance to produce **one block**
* A slot may:

  * contain a block ✅
  * be empty ❌ (if the proposer misses it)

Think of a slot as:

> “This 12-second moment where *someone could* add a block.”

**Key points**

* Slots always exist, even if no block is produced
* Slot number always increases

---

## 2. Block & block_hash — the actual data 📦

### Block

A **block** is created *inside* a slot and contains:

* transactions
* execution results
* references to previous blocks

### block_hash

**block_hash = the unique fingerprint of that block**

* Cryptographic hash
* Changes if *anything* in the block changes
* Used to:

  * link blocks together
  * identify a block in APIs
  * verify integrity

Think of it as:

> “The block’s ID.”

**Important**

* Slots can exist without blocks
* block_hash only exists **if a block was produced**

---

## 3. Epoch — groups of slots 📆

**Epoch = 32 slots**

* 32 × 12 seconds ≈ **6.4 minutes**
* Ethereum uses epochs for:

  * validator voting
  * finality
  * rewards & penalties

Think of an epoch as:

> “A short round where validators check in and agree.”

---

## How they relate (this is the big picture)

```
Epoch
 ├── Slot 0 → may have a block (block_hash)
 ├── Slot 1 → may have a block (block_hash)
 ├── Slot 2 → empty
 ├── ...
 └── Slot 31
```

* **Slots** are time units
* **Blocks** may appear in slots
* **block_hash** identifies each block
* **Epochs** group slots for consensus decisions

---
