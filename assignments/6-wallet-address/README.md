# Custom Mnemonic to Ethereum Address Generator

This project demonstrates how a cryptographic wallet can be built from scratch using basic primitives.  
It starts from secure randomness, turns that randomness into human readable words, hashes those words into a seed, derives a private key, generates a public key using secp256k1, and finally produces an Ethereum address.

This is an educational implementation meant to explain the full flow in simple human language.


## What This Project Does

This script generates an Ethereum address by following a clear logical chain.

1. Random numbers
2. Mnemonic words  
3. Mnemonic phrase  
4. Seed  
5. Private key  
6. Public key  
7. Ethereum address  

Every step is visible, logged, and easy to follow.


## Dictionary and Words

A local dictionary.json file is used as the word source.

The dictionary values are converted into an array of words. Each random number is mapped to one word using modulo arithmetic so it always fits inside the dictionary length.

This is similar in spirit to BIP-39 but simplified for learning purposes.

## Step by Step Process

### 1. Secure Random Number Generation

The process starts with a cryptographically secure random number generator.

Node.js crypto.randomBytes is used to generate random bytes.  
Each byte is a number between 0 and 255.

These numbers are the root of all security in this system.

If randomness is weak, everything after it is weak.

---

### 2. Converting Random Numbers to Words

Each random number is converted into a word.

The number is reduced using modulo dictionary length so it always maps to a valid word index.

This creates a list of human readable words.

---

### 3. Creating the Mnemonic Phrase

All generated words are concatenated into a single phrase separated by spaces.

This phrase is the mnemonic phrase.

Example

word1 word2 word3 word4 ...

At this stage it is just text and has no cryptographic power yet.

---

### 4. Creating the Seed Using SHA-256

The mnemonic phrase is hashed using SHA-256.

The output is a 256-bit value represented as 64 hex characters.

This hash is treated as the seed.

The seed represents all previous steps combined.

---

### 5. Creating the Private Key Using Keccak-256

The seed is hashed again using Keccak-256.

This produces another 256-bit value.

This value is treated as the Ethereum private key.

At this point you must treat it as extremely sensitive data.

Anyone with this key owns the funds.

---

### 6. Generating the Public Key Using secp256k1

The private key is passed into the secp256k1 elliptic curve.

This produces a public key.

The public key is uncompressed and starts with 0x04.

It contains both X and Y coordinates of the elliptic curve point.

---

### 7. Hashing the Public Key

The 0x04 prefix is removed from the public key.

The remaining bytes are hashed using Keccak-256.

This produces a 32 byte hash.

---

### 8. Creating the Ethereum Address

The last 20 bytes of the public key hash are taken.

That is 40 hexadecimal characters.

0x is prepended to the result.

This final value is the Ethereum address.

---

## Final Output Summary

Mnemonic phrase  
Seed generated using SHA-256  
Private key generated using Keccak-256  
Public key generated using secp256k1  
Ethereum address derived from public key hash  

Each step depends fully on the previous one.

---

## Important Notes

This implementation is for learning and experimentation.

It does not fully follow official wallet standards.

Do not use this code to store real funds.

---

## How Real Wallets Improve This Process

Real wallets such as MetaMask or hardware wallets add extra security layers.

Below are the key improvements.

---

## BIP-39 Mnemonic Standard Improvement

Instead of directly hashing the mnemonic phrase, real wallets do the following:

The mnemonic words come from a fixed 2048 word list.

A checksum is embedded inside the mnemonic.

This ensures typing errors can be detected.

---

## PBKDF2 with 2048 Rounds

After generating the mnemonic phrase, real wallets do not hash it only once.

They use PBKDF2 with HMAC-SHA512.

The mnemonic phrase is used as the password.

An optional passphrase is added as salt.

The hashing process is repeated 2048 times.

This makes brute force attacks much slower.

This step dramatically improves security.

---

## Hierarchical Deterministic Wallets

Instead of generating one key, real wallets generate a master seed.

From that seed, unlimited private keys can be derived.

This allows one mnemonic to control many addresses.

This is defined in BIP-32 and BIP-44.

---

## Why This Project Still Matters

This code shows what is really happening under the hood. It shows that wallets are built from simple cryptographic steps.

Understanding this flow makes you a better blockchain developer.

---

## Final Warning

Never expose private keys or seeds.

Never log them in production.

Never store them in plain text.

This project is for educational purposes only.
