# Wallet Derivation & Quantum Security

## BIP-32 Wallet Implementation

I created a Node.js script using `ethers.js` and `bip39` to simulate the wallet creation process:
1.  **Entropy -> Mnemonic:** Generated a 12-word phrase.
2.  **Mnemonic -> Seed:** Converted phrase to binary seed (BIP-39).
3.  **Seed -> Master Key -> Child Key:** Derived the specific Ethereum address using the BIP-32/44 standard path `m/44'/60'/0'/0/0`.

### Proof of Work (Sepolia Transaction)
I generated a wallet address using my script and funded it with Sepolia ETH.

* **Generated Address:** 
```bash
0xCB4E46F50B2cD887A4eda4d0f65061A8DFc18e56
```

* **Sepolia Transaction Hash:** 
```bash
0xe3c31620a5abb6cef3a6f7bb43f50471162b3c3c46c8ab1532916e843237cad3
```

---

## Quantum Security Improvements

* Current Ethereum accounts rely on **Elliptic Curve Cryptography (secp256k1)**. A sufficiently powerful quantum computer running **Shor's Algorithm** could efficiently calculate a private key from a known public key, rendering all standard wallets insecure.

### Proposed Improvements for Quantum Resistance

To secure this algorithm against quantum threats, we can replace the signing and derivation mechanisms with **Post-Quantum Cryptography (PQC)** schemes:

#### 1. Hash-Based Signatures (e.g., SPHINCS+)
Instead of Elliptic Curves, we can use hash-based signatures. Quantum computers are not significantly better at finding hash collisions than classical computers (Grover’s algorithm only provides a quadratic speedup, which can be countered by simply increasing the hash length). The trade-off is larger signature sizes and slower verification times.

#### 2. Lattice-Based Cryptography (e.g., Dilithium or Falcon)
These rely on geometric problems in high-dimensional lattices (like finding the shortest vector). These problems are currently believed to be hard for both classical and quantum computers to solve. Ethereum could introduce a new account abstraction type (ERC-4337) that allows transactions to be signed using lattice-based keys instead of ECDSA.

#### 3. STARKs (Scalable Transparent Arguments of Knowledge)
ZK-STARKs rely solely on hash functions and information theory, making them inherently quantum-resilient. Starknet and other ZK-rollups are already "Post-Quantum Secure" because they don't rely on the elliptic curve assumptions that trap standard Ethereum Layer 1.