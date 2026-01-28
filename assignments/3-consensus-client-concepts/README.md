# Ethereum Proof-of-Stake Consensus Concepts

## 1. Execution Hash


The **Execution Hash** (or the `execution_payload.block_hash`) is the cryptographic hash of an execution-layer block produced by the **execution client** (e.g., Geth, Nethermind).

Its purpose is to:
- Uniquely identify the execution result of a block
- Commit to the **state transition** caused by transactions
- Link the execution layer to the consensus layer

In Ethereum PoS, consensus clients do **not execute transactions themselves**. Instead, they rely on the execution hash as a cryptographic commitment to execution correctness.

---

### How It’s Calculated

The execution hash is computed by hashing the execution block header using **Keccak-256**.

Included fields typically include:
- Parent execution block hash
- State root
- Transactions root
- Receipts root
- Gas used, gas limit
- Timestamp
- Fee recipient

```text
execution_hash = keccak256(rlp_encode(execution_block_header))
````

---

### Role in Transaction Verification

* Validators verify that the execution payload hash matches what the execution client reports
* If the execution hash differs, the block is considered **invalid**
* This prevents dishonest proposers from lying about execution results

---

### Relationship to Execution Payload

The **Execution Payload** is embedded inside a beacon block and contains:

* Transactions
* State changes
* Receipts

The execution hash is the cryptographic summary of this payload.

---

## 2. Finalized Root

### Meaning of Finalization in Consensus

**Finalization** means a block is considered **irreversible** unless a massive portion of stake is slashed.

In Ethereum PoS:

* A block is *finalized* after receiving enough validator votes across epochs
* Finalized blocks cannot be reverted without catastrophic penalties

---

### How Finalized Roots Are Determined

Finalization occurs through **Casper FFG (Friendly Finality Gadget)**:

1. Validators vote on checkpoints
2. A checkpoint is *justified*
3. A justified checkpoint followed by another justified checkpoint becomes *finalized*

The **finalized root** is the hash of the finalized checkpoint block.

---

### Importance for Chain Security

Finalized roots provide:

* Strong economic finality
* Protection against long-range attacks
* Confidence for exchanges, bridges, and rollups

Once finalized:

* History before that point is cryptographically and economically locked

---

### Finality Checkpoints

* Checkpoints occur at **epoch boundaries**
* Every epoch has:

  * A justified checkpoint
  * Potentially a finalized checkpoint


---

## 3. Epoch

### Definition and Duration

An **epoch** is a fixed group of slots.

* **1 epoch = 32 slots**
* **1 slot = 12 seconds**
* **1 epoch ≈ 6.4 minutes**

Epochs are fundamental timing units in Ethereum PoS.

---

### Role in the Consensus Protocol

Epochs are used for:

* Validator attestation aggregation
* Finalization voting
* Reward and penalty calculations
* Validator shuffling

Consensus logic often triggers **only at epoch boundaries**, not per block.

---

### Epoch Boundaries and Transitions

At the end of an epoch:

* Validator votes are evaluated
* Checkpoints may become justified or finalized
* Validator duties are reshuffled for the next epoch

---

### Validator Duties per Epoch

Each validator:

* Proposes at most one block (rare)
* Attests in most epochs
* Participates in sync committees (if selected)


---

## 4. Block Hash

### Cryptographic Hash Function Used

Ethereum uses **Keccak-256** (not SHA-256).

```js
keccak256(block_header)
```

---

### What Data Is Included in the Hash

The block hash commits to:

* Parent block hash
* State root
* Transactions root
* Receipts root
* Slot number
* Proposer index
* Execution payload hash

This makes the block hash a **tamper-evident fingerprint**.

---

### Role in Chain Integrity

* Any change in block data changes the hash
* Blocks form a hash-linked chain
* Tampering with one block invalidates all descendants

---

### Relationship to Parent Blocks

Each block includes:

```text
parent_root = hash(previous_block)
```

This creates the blockchain’s linear structure.

---

## 5. Fork Choice

### Fork Choice Rule Explanation

The **fork choice rule** determines which chain is considered *canonical* when multiple valid chains exist.

Ethereum PoS uses:
**LMD-GHOST (Latest Message Driven – Greediest Heaviest Observed SubTree)**

---

### How the Canonical Chain Is Selected

The rule:

* Tracks validator attestations
* Weights branches by total stake voting for them
* Selects the “heaviest” subtree

In short:

> Follow the chain with the most recent validator support

---

### Handling Competing Blocks

When two blocks exist for the same slot:

* Validators vote
* Fork choice resolves the conflict
* Losing blocks become orphaned

Finalization prevents late reorgs beyond finalized checkpoints.

---

### LMD-GHOST Algorithm (High-Level)

```text
Start from finalized root
For each fork:
  Sum validator weights
Choose branch with maximum weight
Repeat until head is found
```

➡️ Depends on: **Slots**, **Epoch**, **Finalized Root**

---

## 6. Slots

### Slot Definition and Timing

A **slot** is a fixed time window in which:

* A block *may* be proposed

* Validators attest to blocks

* **1 slot = 12 seconds**

---

### Slots per Epoch

* **32 slots = 1 epoch**
* Some slots may not contain blocks

---

### Block Proposal Mechanism

For each slot:

* One validator is randomly selected to propose
* If they fail, the slot is **missed**

```text
slot → proposer → block (optional)
```

---

### Missed Slots and Their Implications

Missed slots:

* Do not halt the chain
* Reduce chain “density”
* Slightly affect rewards
* Do NOT break finality

Fork choice naturally skips over missed slots.

---

## Conclusion

Ethereum’s Proof-of-Stake consensus is a layered system where:

* **Slots** define time
* **Epochs** define structure
* **Fork choice** defines the present
* **Finalized roots** define the past
* **Execution hashes** bind execution to consensus
`
