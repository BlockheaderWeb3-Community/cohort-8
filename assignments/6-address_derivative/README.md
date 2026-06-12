# Ethereum Wallet Generator in Rust

This project demonstrates how to generate an **Ethereum wallet** in Rust using industry standards such as **BIP-39**, **BIP-32/BIP-44**, and **Keccak256**.

The program:
- Generates cryptographically secure entropy
- Creates a 12-word mnemonic phrase
- Derives an Ethereum private key using a BIP-44 path
- Computes the public key
- Generates an Ethereum address

---

## Dependencies

This project uses the following crates:

- **bip39** – mnemonic phrase generation (BIP-39)
- **tiny-hderive** – hierarchical deterministic key derivation (BIP-32 / BIP-44)
- **k256** – secp256k1 elliptic curve cryptography (Ethereum keys)
- **sha3** – Keccak256 hashing (Ethereum address format)
- **hex** – hexadecimal encoding
- **rand (OsRng)** – secure randomness from the operating system

---

## What the Code Does (High-Level)

```text
OS Randomness
   ↓
Entropy
   ↓
12-word Mnemonic
   ↓
Seed
   ↓
Private Key
   ↓
Public Key
   ↓
Ethereum Address