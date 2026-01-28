### Ethereum Beacon Chain Observables for a Geth Node


#### Quick Reference Facts

- **Slot**: 12 seconds.  
- **Epoch**: 32 slots.  
- **Epoch duration**: \(32 \times 12\text{s} = 384\text{s} \approx 6.4\) minutes.  
- **Finality requirement**: Justification and finalization require attestations representing at least **2/3 of effective stake**; reverting a finalized epoch implies slashable stake > 1/3.  
- **Fork choice**: LMD GHOST with Casper FFG overlay.  
- **Execution hash**: The hash that links a beacon header to an execution-layer block (execution payload).

---
## LMD GHOST

## Meaning
**LMD GHOST** stands for **Latest Message Driven Greedy Heaviest Observed SubTree**.  
It is the fork-choice rule used in Ethereum’s Proof-of-Stake consensus to decide which block is the head of the chain.

- **LMD** = Latest Message Driven → Only the most recent attestation (vote) from each validator counts.
- **GHOST** = Greedy Heaviest Observed SubTree → The algorithm walks down the chain, always choosing the branch with the most cumulative weight.

---

## How It Works
1. Start at the most recent **justified checkpoint**.
2. At each fork, calculate the weight of each child subtree based on validators’ latest attestations.
3. Pick the child with the highest weight.
4. Repeat until reaching a leaf → that block becomes the **head of the chain**.

---

## Role in Ethereum
- **Consensus Layer**: LMD GHOST is the fork-choice rule for the beacon chain.
- **Execution Layer Link**: The chosen head block references an execution payload (transactions, state changes).
- **Finality**: LMD GHOST itself doesn’t provide finality; finality is achieved via the **Casper FFG overlay**.

---

## Advantages
- **Fast convergence**: Quickly shifts chain weight toward the correct branch.
- **Security**: Resistant to “nothing at stake” attacks since only latest attestations count.
- **Efficiency**: Simplifies consensus by ignoring outdated votes.

---

## Limitations
- **No finality guarantee**: Without FFG, LMD GHOST alone can reorg indefinitely.
- **Dependent on validator honesty**: If many validators fail to attest, fork choice can stall.

---

## Comparison: LMD GHOST vs Nakamoto Consensus

| Feature              | LMD GHOST (Ethereum PoS) | Nakamoto Consensus (Bitcoin PoW) |
|----------------------|---------------------------|----------------------------------|
| **Basis of weight**  | Latest validator attestations | Cumulative proof-of-work difficulty |
| **Finality**         | Requires FFG overlay (≥2/3 stake) | Probabilistic (more confirmations = safer) |
| **Speed**            | 12s slots, fast head updates | ~10 min blocks, slower convergence |
| **Security model**   | Stake-based, slashing penalties | Energy-based, mining difficulty |

---

## Summary of LMD GHOST
LMD GHOST is Ethereum’s fork-choice algorithm that uses validators’ latest votes to greedily select the heaviest chain branch.  
It ensures fast head selection, while Casper FFG provides true finality.


# Casper FFG Explained

## Meaning
**Casper FFG** stands for **Friendly Finality Gadget**.  
It is the finality mechanism used in Ethereum’s Proof-of-Stake consensus. Casper FFG overlays the fork-choice rule (LMD GHOST) to provide strong finality guarantees for blocks and epochs.

- **Casper** → Family of Proof-of-Stake protocols designed for Ethereum.  
- **FFG (Friendly Finality Gadget)** → A gadget that adds finality to an existing fork-choice rule.

---

_Once finalized, a checkpoint (and all blocks before it) is considered **irreversible** unless >1/3 of validators misbehave (which would lead to slashing)._

---

## How It Works
1. Validators vote (attest) for blocks and checkpoints.  
2. If ≥2/3 of stake votes for a checkpoint, it becomes **justified**.  
3. If the child of a justified checkpoint is also justified, the parent becomes **finalized**.  
4. Finalized checkpoints are locked in — they cannot be reverted without catastrophic validator slashing.  

---

## Role in Ethereum
- **LMD GHOST** decides the *head of the chain* (current tip).  
- **Casper FFG** ensures *finality* by locking in checkpoints.  
- Together, they provide both **liveness** (chain keeps growing) and **safety** (finalized blocks cannot be reverted).  

---

## Advantages
- **Strong finality guarantees**: Once finalized, history is immutable unless >1/3 of validators collude.  
- **Economic security**: Misbehaving validators lose their stake (slashing).  
- **Modular design**: Can be layered on top of different fork-choice rules.  

---

## Limitations
- **Finality stalls**: If validators are offline or network partitions occur, finalization can pause.  
- **Slashing risk**: Validators must follow rules carefully; double voting or surround voting leads to slashing

## Slot

#### Definition
A **slot** is the smallest time unit in the beacon chain. Each slot is an opportunity for a validator to propose a beacon block.

#### Properties
- **Duration**: 12 seconds.
- **Proposal**: At most one beacon block can be proposed per slot (subject to network conditions).
- **Observables**: `slot` field in beacon block headers and beacon state.
---

## Epoch
#### Definition
An **epoch** is a group of 32 consecutive slots.

#### Properties
- **Slots per epoch**: 32.
- **Duration**: \(32 \times 12\text{s} = 384\text{s} \approx 6.4\) minutes.
- **Checkpoints**: Epoch boundaries define checkpoints used by Casper FFG for justification and finalization.

#### Role in consensus
- Attestations are aggregated and processed with epoch granularity for justification/finality.
- Many protocol operations (e.g., validator rewards, slashings, epoch transitions) are computed at epoch boundaries.

---

## Beacon Block and Execution Payload

#### Beacon Block
- **Definition**: The consensus-layer container that includes consensus data (parent root, proposer index, attestations, etc.) and, after the Merge, an **execution payload header** referencing the execution-layer block.
- **Key header fields**:
  - `slot`
  - `proposer_index`
  - `parent_root`
  - `state_root`
  - `body_root`
  - `execution_payload_header` (post-Merge)

#### Execution Payload
- **Definition**: The execution-layer block (transactions, receipts, state changes) that the beacon block commits to.
- **Key fields inside execution payload or header**:
  - `block_hash` or `execution_hash` (identifier of the execution block)
  - `parent_hash`
  - `state_root`
  - `receipts_root`
  - `transactions_root`
  - `gas_used`
  - `base_fee_per_gas`
  - `transactions`
  - `withdrawals` (if present)
- **Linking**: The beacon header contains the execution payload header which includes the execution hash; this binds consensus to execution.

#### Example beacon block header snippet
```json
{
  "slot": 123456,
  "proposer_index": 789,
  "parent_root": "0xabc...",
  "state_root": "0xdef...",
  "body_root": "0x012...",
  "execution_payload_header": {
    "parent_hash": "0x111...",
    "fee_recipient": "0x222...",
    "state_root": "0x333...",
    "receipts_root": "0x444...",
    "logs_bloom": "0x...",
    "prev_randao": "0x...",
    "block_number": 15000000,
    "gas_limit": 30000000,
    "gas_used": 21000,
    "timestamp": 1700000000,
    "base_fee_per_gas": "0x7a120",
    "block_hash": "0xexecutionhash..."
  }
}
```

---

## Root

#### Root types
- **Block root**: Hash of a block header; uniquely identifies a block.
- **State root**: Merkle root representing the execution world state after the block.
- **Body root**: Hash of the block body (consensus payloads).
- **Receipts root**: Merkle root of transaction receipts.
- **Finalized root**: The root of the checkpoint that has been finalized by the consensus protocol.




---

## Finalized Epoch

#### Definition
The **finalized epoch** is the epoch number of the most recent checkpoint that has been finalized by the Casper FFG finality mechanism.

#### How finality works (high level)
1. Validators produce attestations that vote for checkpoints (epoch boundary headers).
2. A checkpoint becomes **justified** when it gathers attestations representing ≥2/3 of effective stake.
3. If a justified checkpoint’s child checkpoint is also justified, the parent becomes **finalized**.
4. Finality implies that reverting the finalized checkpoint would require slashable behavior affecting >1/3 of stake.
---

## Fork Choice

#### Components
- **LMD GHOST**: Latest Message Driven Greedy Heaviest Observed Sub-Tree. It selects the head by walking the block tree and choosing the child subtree with the highest weight computed from validators’ latest attestations.
- **Casper FFG overlay**: Finality gadget that justifies and finalizes checkpoints on top of LMD GHOST.

#### How LMD GHOST works
- Each validator’s latest attestation contributes weight to the branch that contains the attested block.
- The algorithm starts at the justified checkpoint and greedily selects the child with the highest cumulative weight until it reaches a head.

#### Practical observables and APIs
- **Fork choice head**: The block root considered the head by the consensus client.
- **Engine API**: `engine_forkchoiceUpdated` is called by the consensus client to inform the execution client of the current fork choice state and to request payloads or status updates.

#### Example fork choice update payload (conceptual)
```json
{
  "head_block_hash": "0xhead...",
  "safe_block_hash": "0xsafe...",
  "finalized_block_hash": "0xfinalized..."
}
```

---

## Execution Hash

#### Definition
The **execution hash** (often `block_hash` inside the execution payload header) uniquely identifies the execution-layer block that the consensus header commits to.

#### Purpose
- Binds the consensus header to a specific execution block.
- Allows the consensus client and light clients to verify execution-layer commitments without re-executing all transactions.
- Used by the Engine API to request or validate payloads.
---

## Observables on a Node

#### Beacon state fields to watch
- `slot`
- `latest_block_header`
- `finalized_checkpoint` (`epoch`, `root`)
- `justified_checkpoint` (`epoch`, `root`)
- `validators` (status, balances, slashed flags)

#### Beacon block header fields to watch
- `slot`
- `proposer_index`
- `parent_root`
- `state_root`
- `body_root`
- `execution_payload_header.execution_hash` or `block_hash`

#### Engine API fields to watch
- `engine_forkchoiceUpdated` parameters and responses
- `engine_getPayload` responses
- `engine_newPayload` responses and validation results

#### Execution client (Geth) fields to watch
- `block number`
- `block hash`
- `state root`
- `receipts root`
- `gas used`
- `base fee per gas`
- `sync status` and `head` vs `finalized` mapping

---

## Example JSON Snippets

#### Beacon state finalized checkpoint snippet
```json
{
  "finalized_checkpoint": {
    "epoch": 3850,
    "root": "0xfinalizedroot..."
  },
  "justified_checkpoint": {
    "epoch": 3851,
    "root": "0xjustifiedroot..."
  },
  "slot": 123456
}
```

#### Engine forkchoice update request example
```json
{
  "jsonrpc": "2.0",
  "method": "engine_forkchoiceUpdated",
  "params": [
    {
      "headBlockHash": "0xhead...",
      "safeBlockHash": "0xsafe...",
      "finalizedBlockHash": "0xfinalized..."
    },
    "payloadAttributes"
  ],
  "id": 1
}
```

#### Engine get payload response example
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "payload": {
      "parentHash": "0x111...",
      "feeRecipient": "0x222...",
      "stateRoot": "0x333...",
      "receiptsRoot": "0x444...",
      "logsBloom": "0x...",
      "prevRandao": "0x...",
      "blockNumber": 15000000,
      "gasLimit": 30000000,
      "gasUsed": 21000,
      "timestamp": 1700000000,
      "baseFeePerGas": "0x7a120",
      "blockHash": "0xexecutionhash...",
      "transactions": ["0x..."]
    }
  }
}
```

---

## Reorgs, Finality Stalls, and Risks

#### Reorgs
- **Non-finalized blocks** can be reorged by fork choice. Depth of reorgs depends on network conditions and validator behavior.
- **Finalized blocks** are considered irreversible under normal conditions.

#### Finality stalls
- Occur when validators fail to produce enough attestations to justify and finalize checkpoints.
- Causes: validator downtime, network partitions, misconfiguration, or coordinated attacks.
- Mitigation: monitor validator liveness, ensure time synchronization, and maintain connectivity to peers.


---

## Key summary
- **Attestation**: A validator vote for a block or checkpoint.
- **Justified checkpoint**: A checkpoint that has gathered sufficient attestations to be considered justified.
- **Finalized checkpoint**: A justified checkpoint whose child is also justified; considered irreversible.
- **LMD GHOST**: Fork-choice algorithm using latest messages to weight branches.
- **FFG**: Friendly Finality Gadget (Casper FFG) used for justification and finalization.


