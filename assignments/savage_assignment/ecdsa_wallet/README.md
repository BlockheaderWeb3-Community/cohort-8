# Ethereum Address Generator

Simple script that generates an Ethereum address from a random mnemonic phrase.

## What it does

1. Generates a random 12-word mnemonic phrase
2. Converts mnemonic to seed using SHA256
3. Derives private key from seed using Keccak256
4. Generates public key from private key using ECDSA
5. Creates Ethereum address from public key

## Install

```bash
npm install ethers
```

## Run

```bash
node address.js
```

## Output

---- Mnemonic Phrase ----
Generated Mnemonic is: word word word...

---- SEED ----
The SEED is: 0x...

----- Private Key -----
The Private Key is: 0x...

----- Output-----
The Public Key is: 0x...

this is the address: 0x...

## How Ethereum Addresses Work

- Mnemonic → Seed → Private Key → Public Key → Address
- Address is last 40 characters of hashed public key
- Prefix with `0x` for standard format

## Note

This is for learning purposes. Real wallets use BIP39/BIP32 standards for proper mnemonic-to-seed conversion.
