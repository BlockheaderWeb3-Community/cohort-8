## Key Concepts of Blockchain Consensus

* **Exec Hash:** In Ethereum, this specifically refers to the Execution Payload Hash. This is the unique hash of the Execution Payload, the bundle of user transactions, smart contract interactions, and state changes managed by the Execution Layer (EL).

The Consensus Layer (Beacon Chain) doesn't verify individual transactions; it trusts the Execution Layer to do that. The Exec Hash is the cryptographic fingerprint the Consensus Layer holds to say, "This is the valid bundle of transactions for this block". It bridges the two layers.

* **Block Hash:** This is the unique identifier for the entire Beacon Block. Since Ethereum moved to Proof-of-Stake, a Block is actually a Beacon Block that wraps two things; the Consensus Data (Votes, attestations, and validator info) and Execution Payload (The user transactions which has its own Exec Hash). This hash is signed by the validator proposing the block. If you change one bit of data (even a single transaction), this hash changes entirely, breaking the chain.

* **Slots:** A Slot is a fixed 12-second window of time. In every slot, one validator is chosen to propose a block. A slot can be empty if the chosen validator is offline or misses their turn.

* **Epochs:** An Epoch is a bundle of 32 Slots (12 seconds * 32 = 6.4 minutes).  The network doesn't finalize blocks one by one; it finalizes them in Epochs and validators are shuffled into new committees at the start of every epoch to prevent collusion.

* **Finalized Epoch:** This is a period of time (an epoch) that the network has agreed is "settled" forever. A block is "Finalized" when >2/3 of the total staked ETH has voted for it. Once finalized, it cannot be reverted without burning at least 1/3 of all staked ETH (billions of dollars), making it economically secure.

* **Finalized Root:** This is the Root Hash (fingerprint) of the "Checkpoint Block" at the start of that finalized epoch. It serves as the ultimate anchor of trust. If your wallet wants to prove a transaction happened, it traces a path back to this Finalized Root.

* **Fork Choice:** Sometimes two validators propose blocks at the same time, creating a split (fork) in the chain. Ethereum uses an algorithm called LMD-GHOST (Latest Message Driven Greedy Heaviest Observed Subtree). It looks at the "weight" of votes (attestations) from validators, it doesn't just look for the longest chain; it looks for the chain with the most support (votes) from validators in their latest messages, and the chain with the "heaviest" voting weight becomes the canonical (main) chain.


