---
title: 'Address Generator'
disqus: hackmd
---

Address Generator Project
===

## Table of Contents

[TOC]

## Installation

Run `npm install` to install dependencies.

## Running the program

Run `npm run dev` to run the program.


## Code overview
Using BIP 39, BIP 32 and BIP 44, write a program that uses BIP 39 to generate an entropy, uses the entropy to generate a Mnemonic phrase. The Mnemonic phrase is converted to it's binary representation to create a seed. BIP 32 generates multiple private keys, to create a public key and an address.
BIP 44 ensures the keys ca be used on multi chains.

## Code flow
The `generateEntropy` function generates a random bits used by `generateMnemonic` function to create a mnemonic phrase. The `generateSeed` function converts the phrase to a seed.
`createMasterKey` function creates a private key and public key using the key generated above.

The `generateAddress` function allows to specify between bitcoin and ethereum in creating address
 

```
function generateAddress(publicKey, coinType = 60) {
  if (coinType === 0) {
    // Bitcoin address (P2PKH Legacy format)
    return generateBitcoinAddress(publicKey);
  } else if (coinType === 60) {
    // Ethereum address
    return generateEthereumAddress(publicKey);
  }
}
```

The `deriveAddressFromEntropy` function runs the program from generating entropy to generating addresses.