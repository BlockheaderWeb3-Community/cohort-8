# Merkle Tree Implementation in Rust (SHA-256 & Keccak256)

This project demonstrates how a **Merkle Tree** works by hashing a list of transactions and recursively combining them to produce a **Merkle root**.

The implementation is written in Rust and shows:
- How transactions are hashed
- How Merkle tree levels are built
- How the final Merkle root is computed
- The difference between using **SHA-256** and **Keccak256**

This is an **educational implementation**, designed to help understand blockchain data structures.

---

## Dependencies

This project uses the following Rust crates:

- **sha2** – SHA-256 hashing
- **sha3** – Keccak256 hashing
- **ethers::utils::hex** – Hexadecimal encoding
- **std::io** – Reading user input

---

## What the Program Does (High-Level)

```text
Transactions
   ↓
SHA-256 hash of each transaction
   ↓
Pairwise hash concatenation
   ↓
Repeated hashing of levels
   ↓
Merkle Root
