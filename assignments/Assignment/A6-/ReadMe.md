# Ethereum Hierarchical Deterministic (HD) Wallet Generation Demo

## Overview

This Node.js script demonstrates the complete process of generating an Ethereum-compatible hierarchical deterministic (HD) wallet using industry standards:

- **BIP39**: Generates a 12-word mnemonic phrase from random entropy.
- **BIP32**: Derives a master extended key (root node) from the seed and performs hardened/normal path derivation.
- **BIP44**: Uses the standard Ethereum derivation path `m/44'/60'/0'/0/i` to generate multiple accounts.
- Ethereum address derivation: Computes the uncompressed public key, applies Keccak-256 hashing, and extracts the last 20 bytes to form the checksum-less address.

The script generates one random mnemonic and then derives and displays full key material (private key, public key, Keccak-256 hash, and final address) for the first 5 accounts (indices 0–4).

## Development Process – Step by Step

1. **Research standard libraries**: Selected packages for each cryptographic step to ensure compatibility with Ethereum wallet standards (e.g., MetaMask, Ledger).

2. **Generate secure randomness**: Used Node.js built-in `crypto.randomBytes(32)` to produce 256 bits of entropy (required for a 24-word mnemonic; here using 32 bytes yields a valid 24-word phrase in practice, though standard 12-word uses 16 bytes — this example prioritizes stronger entropy).

3. **Create mnemonic**: Converted entropy to a human-readable BIP39 mnemonic using `bip39.entropyToMnemonic`.

4. **Derive seed**: Converted the mnemonic to a 64-byte seed using `bip39.mnemonicToSeedSync`.

5. **Initialize BIP32**: Set up elliptic curve operations with `tiny-secp256k1` and created a BIP32 factory to generate the root node from the seed.

6. **Derive child keys**: Used the standard Ethereum BIP44 path `m/44'/60'/0'/0/i`, looping over indices 0 to 4 to derive distinct child nodes.

7. **Public key generation**: For each child, extracted the private key and used `secp256k1.publicKeyCreate(privateKey, false)` to get the uncompressed public key (65 bytes with 0x04 prefix), then sliced off the prefix to get the 64-byte concatenated x/y coordinates.

8. **Address calculation**: Applied Keccak-256 (via `ethereumjs-util`) to the 64-byte public key, then took the last 20 bytes and prefixed with "0x" to form the Ethereum address (no EIP-55 checksum added for simplicity).

9. **Structured logging**: Added clear, labeled console outputs for the mnemonic and each address's full derivation details to make the process transparent.

## Packages Used

All packages are installed via npm:

```bash
npm install bip39 bip32 tiny-secp256k1 secp256k1 ethereumjs-util
```

- **bip39**: For mnemonic generation and seed derivation.
- **bip32** + **tiny-secp256k1**: For hierarchical deterministic key derivation using the secp256k1 curve.
- **secp256k1**: For raw public key creation from private key.
- **ethereumjs-util**: Provides the Keccak-256 hash function (`keccak256`).
- **crypto**: Built-in Node.js module for secure random entropy.

## Running the Code

1. Save the code to a file (e.g., `key.js`).
2. Install dependencies: `npm install bip39 bip32 tiny-secp256k1 secp256k1 ethereumjs-util`
3. Execute: `node key.js`

Each run will produce a completely new random mnemonic and set of keys/address.

## Result Preview

Sample console output from one execution (values will differ on every run due to randomness):

```
Mnemonic Phrase:
attack cousin pottery ... (24 random words from BIP39 wordlist)

Address #0
Private Key:
e8f32e723decf405... (64 hex characters)
Public Key (64 bytes):
3a2e1f9d... (128 hex characters — concatenated x and y coordinates)
Keccak-256 Hash of Public Key:
d1c3f5e5... (64 hex characters)
Ethereum Address:
0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed

Address #1
Private Key:
f7a2c1d4... (different 64 hex)
Public Key (64 bytes):
9b4d3e2f...
Keccak-256 Hash of Public Key:
a7f89c2d...
Ethereum Address:
0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359

... (continues for Addresses #2, #3, #4)
```

The five addresses generated are sequential accounts from the same master seed, exactly as hardware/software wallets do. You could restore all of them by importing just the mnemonic phrase into any BIP39/BIP44-compatible wallet.