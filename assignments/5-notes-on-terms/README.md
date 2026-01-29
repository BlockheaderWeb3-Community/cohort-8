# Read, and write notes on: Exec hash, finalized root, epoch, block hash, slots, and fork choice

## Block Hash

**Block hash** in Ethereum is the cryptographic hash of the **block header**, which uniquely identifies each block and ensures the integrity of the blockchain.  
It is generated using the **Keccak-256** hashing algorithm and includes all critical fields from the block header, such as:

+ Parent block hash: This links the current block to its predecessor. 
+ Timestamp: when the block was created. 
+ Nonce: a value used in the proof-of-stake consensus process. 
+ Difficulty level: indicates the complexity of mining the block (in PoW; now less relevant in PoS). 
+ Merkle roots: hashes of the transaction tree, state tree, and receipt tree, summarizing the block&apos;s contents. 

Any change in the block header&dash;even a single bit&dash;results in a completely different block hash, making tampering detectable. This cryptographic linkage ensures the immutability of the Ethereum blockchain. 

The block hash is essential for verifying the authenticity and order of blocks across the network. It is also used in smart contracts via the blockhash opcode to reference the hash of a past block (up to 256 blocks back), enabling time-based logic and stateless validation. 

## Finalized root 
**Finalized Root in Ethereum** refers to the **state root** of the most recent block that has been finalized by the consensus mechanism, specifically within Ethereum's Proof-of-Stake (PoS) system using the Casper FFG (Friendly Finality Gadget) protocol.

The **finalized root** is **a cryptographic hash that represents the entire state of the Ethereum blockchain at a specific block, including all acoount balances, contract storage, and other state data.

## Epoch 
**Epoch in Ethereum** refers to a fixed time period in the Ethereum blockchain. Each epoch consists of **32 slots**, with each slot lasting **12 seconds**, resulting in an epoch duration of approximately **6.4 minutes**.

In other words, 1 epoch is a bundle of 32 * 1 slot (12 seconds) = **6.4 minutes**.
2

Epoch is important to group/bundle slots together, give timeline to validator voting and give a timeline to finalization as it happens at each epoch's boundaries.

## Slots
A **slot** however is an important unit of time in Ethereum's Proof-of-Stake (PoS) consensus mechanism, with each slot taking 12 seconds.

It serves as a scheduled window during which a randomly selected validator is assigned to propose a block.
If the validator is online and functional, they create and broadcast a block; otherwise, the slot remains empty. 

## Fork choice
Fork Choice Rule is a core mechanism in Ethereum that enables nodes to agree on a single, canonical blockchain when the network experiences temporary splits or competing chains.  
It acts as a decision-making protocol ensuring consensus across the decentralized network. 

In Ethereum&apos;s Proof of Stake (PoS) era, following the Merge on September 15, 2022, the **fork choice rule** is defined by the **combination of LMD GHOST (Latest Message Driven Greedy Heaviest Observed SubTree)** and **Casper FFG (Friendly Finality Gadget)**, collectively known as Gasper.  
This system selects the chain head based on the heaviest sub-tree of validator attestations, where each validator&apos;s most recent vote counts toward a block&apos;s weight. 

+ **LMD GHOST** evaluates the chain with the greatest cumulative weight from recent validator attestations, promoting network alignment and resilience against attacks. 
+ **Casper FFG** provides economic finality by finalizing checkpoints when a supermajority (≥2/3) of validator stake agrees, significantly reducing the risk of deep reorganizations. 

This evolution from the Longest Chain Rule (used in Proof of Work) to a validator-weighted, attestation-driven model improves security, finality speed, and energy efficiency.  
The rule ensures that honest nodes converge on the same chain head, maintaining ledger consistency and enabling trust in DeFi, staking, and settlement systems. 
