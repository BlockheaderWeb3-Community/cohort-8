# Ethereum Wallet Generation & Gas Fee Estimation

## Overview

This project demonstrates two core Ethereum concepts:

1. **How Ethereum wallets are generated**
2. **How Ethereum gas fees are calculated and estimated**

The implementation is written in **JavaScript (Node.js)** and focuses on understanding the underlying cryptographic and blockchain principles rather than using abstracted wallet tools.

---

## Part 1: Ethereum Wallet Generation

### What This Program Does

This program:
- Generates cryptographically secure randomness (entropy)
- Converts the entropy into a **BIP-39 mnemonic (seed phrase)**
- Derives a **BIP-32 Hierarchical Deterministic (HD) wallet**
- Generates multiple Ethereum wallets from a single seed
- Produces:
  - Private keys
  - Public keys
  - Ethereum addresses

All wallets are deterministically derived, meaning:
> The same mnemonic will always generate the same addresses.

---

### Technologies & Standards Used

- **BIP-39** – Mnemonic (seed phrase) generation
- **BIP-32** – Hierarchical Deterministic wallets
- **BIP-44** – Standard derivation paths
- **secp256k1** – Elliptic curve cryptography used by Ethereum
- **Keccak-256** – Ethereum’s hashing algorithm

---

### Wallet Derivation Path Explained

m/44'/60'/0'/0/index

| Segment | Meaning |
|------|------|
| `44'` | BIP-44 standard |
| `60'` | Ethereum coin type |
| `0'` | Account index |
| `0` | External addresses |
| `index` | Address number |

---

### Wallet Generation Flow

    Entropy (Random Bytes)
        ↓
    Mnemonic (12 words)
        ↓
    Seed (512-bit)
        ↓
    Master HD Node
        ↓
    Private Key
        ↓
    Public Key
        ↓
    Keccak-256 Hash
        ↓       
    Ethereum Address

