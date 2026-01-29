
# BIP32 Wallet

A simple, lightweight utility for deriving Ethereum wallets from BIP39 mnemonics using hierarchical deterministic (HD) wallets.

## What is this?

This is a straightforward Node.js module that helps you work with Ethereum wallets. It lets you generate mnemonic phrases and derive multiple wallet addresses from a single seed phrase—useful if you want to manage several wallets without storing separate private keys.

## Features

- **Generate BIP39 mnemonics** - Create secure seed phrases
- **Derive Ethereum wallets** - Get address and private key from a mnemonic
- **Batch derivation** - Generate multiple wallets from a single phrase
- **HD wallet support** - Uses standard Ethereum derivation paths (BIP44)

## Installation

First, make sure you have Node.js installed. Then grab the dependencies:

```bash
npm install
```

## Usage

Here's how to get started:

```javascript
const { deriveWallet, generateMnemonic, deriveMultiple } = require('./bip32wallet');

// Create a new random mnemonic
const mnemonic = generateMnemonic();
console.log(mnemonic); // 12 or 24 word seed phrase

// Derive a wallet from it
const wallet = deriveWallet(mnemonic);
console.log(wallet.address);    // Your wallet address
console.log(wallet.privateKey); // Your private key

// Or generate multiple wallets at once
const wallets = deriveMultiple(mnemonic, 5); // Creates 5 wallets
wallets.forEach((w, i) => {
  console.log(`Wallet ${i + 1}: ${w.address}`);
});
```

## API

### `generateMnemonic(strength)`
Generates a random BIP39 mnemonic phrase.
- **strength** (optional): Number of bits (default: 128 = 12 words, 256 = 24 words)
- **Returns**: A string mnemonic phrase

### `deriveWallet(mnemonic, path)`
Derives a single wallet from a mnemonic.
- **mnemonic**: Your seed phrase
- **path** (optional): HD derivation path (default: `m/44'/60'/0'/0/0`)
- **Returns**: Object with `address`, `publicKey`, and `privateKey`

### `deriveMultiple(mnemonic, count, basePath)`
Generate multiple wallets from a single mnemonic.
- **mnemonic**: Your seed phrase
- **count** (optional): How many wallets to create (default: 5)
- **basePath** (optional): Base derivation path (default: `m/44'/60'/0'/0`)
- **Returns**: Array of wallet objects

## Requirements

- Node.js (v12 or higher)
- `bip39` - BIP39 mnemonic utilities
- `ethers` - Ethereum library for wallet operations

## Security Note

Never share your private keys or mnemonic phrases! This code is meant for development and testing. For production use, consider using hardware wallets or proper key management systems.


