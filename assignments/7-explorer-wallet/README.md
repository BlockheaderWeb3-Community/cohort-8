# Cryptographic Wallet + Ethereum Dashboard

This project is a learning-focused Ethereum application built with **React Router**.

It combines:
- A **from-scratch Ethereum wallet generator**
- A **live Ethereum dashboard** (price, gas, blocks, transactions)
- A modern **React + TypeScript + Tailwind** stack

The goal is to **show what is really happening under the hood**, not hide it behind libraries.

This project is for **education and experimentation only**.

---

## What This App Does

This app has two main parts:

1. **Wallet Generator Page**
2. **Ethereum Network Dashboard (Home Page)**

Each part is explained below.

---

## Wallet Generator Page

The wallet page generates a **deterministic Ethereum wallet** step by step.

- Nothing is fetched from an API  
- Nothing is stored in a database  
- Everything is generated locally  

All cryptographic steps are visible and easy to follow.

---

### What You See in the UI

- A **Create Wallet** button
- A generated **Ethereum address**
- A **mnemonic recovery phrase**
- Hold-to-reveal interaction for safety
- Dark / Light theme toggle
- Animated entropy background (visual randomness)

---

## Wallet Generation Flow (Simple Explanation)

This is the exact logic used to generate the wallet.

---

### 1. Secure Random Numbers

The process starts with cryptographically secure randomness.

Node.js `crypto.randomBytes` is used.

Each byte is a number between **0 and 255**.

These numbers are the root of all security.

If randomness is weak, everything after it is weak.

---

### 2. Random Numbers → Words

A local `dictionary.json` file is used as the word source.

- The dictionary values are converted into an array
- Each random number is mapped to a word using modulo arithmetic
- This guarantees the index always fits inside the dictionary

This creates a list of human-readable words.

---

### 3. Mnemonic Phrase

All generated words are joined together using spaces.

Example:


word1 word2 word3 word4 
```yaml

At this stage, it is **just text**.

---

### 4. Mnemonic → Seed (SHA-256)

The mnemonic phrase is hashed using **SHA-256**.

This produces:
- A 256-bit value
- Represented as 64 hexadecimal characters

This hash is treated as the **seed**.

The seed represents all previous steps combined.

---

### 5. Seed → Private Key (Keccak-256)

The seed is hashed again using **Keccak-256**.

This produces another 256-bit value.

This value is used as the **Ethereum private key**.

⚠️ Anyone with this key fully controls the wallet.

---

### 6. Private Key → Public Key (secp256k1)

The private key is passed into the **secp256k1 elliptic curve**.

This generates an **uncompressed public key**.

- Starts with `0x04`
- Contains both X and Y coordinates

---

### 7. Public Key → Hash

- The `0x04` prefix is removed
- The remaining bytes are hashed using **Keccak-256**

This produces a 32-byte hash.

---

### 8. Ethereum Address

- The **last 20 bytes** of the public key hash are taken
- Converted to hexadecimal
- `0x` is prepended

This final value is the **Ethereum address**.

---

## Final Wallet Output

- Mnemonic phrase  
- Seed (SHA-256)  
- Private key (Keccak-256)  
- Public key (secp256k1)  
- Ethereum address  

Each step depends entirely on the previous one.

---

## Important Warning

This wallet logic is **for learning purposes only**.

It does NOT fully follow official wallet standards:
- BIP-39
- BIP-32
- BIP-44

**Do not use this wallet to store real funds.**

---

## How Real Wallets Improve This Process

Real wallets like MetaMask and hardware wallets add extra security layers.

---

### BIP-39 Mnemonic Standard

- Fixed 2048-word list
- Embedded checksum
- Detects typing errors

---

### PBKDF2 (2048 Rounds)

- Uses HMAC-SHA512
- Repeats hashing 2048 times
- Optional passphrase support
- Makes brute-force attacks much slower

---

### Hierarchical Deterministic Wallets

- One mnemonic controls unlimited addresses
- Defined in BIP-32 and BIP-44
- Used by all modern wallets

---

## Ethereum Dashboard (Home Page)

The home page shows **live Ethereum network data**.

---

### Features

- Current **ETH price**
- Current **gas price**
- Latest blocks
- Latest transactions

---

### Technical Details

- Data fetched from the **Sepolia test network**
- Custom React hooks for data fetching
- Loading and error states handled cleanly
- Values formatted from Wei → Gwei / ETH

---

## Tech Stack

- React Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Node.js crypto
- secp256k1
- Keccak-256

---

## Getting Started

### Install Dependencies

```bash
npm install

```


## Run Development Server
```bash 
npm run dev
```


The app will be available at:

```arduino
http://localhost:5173
```

## Build for Production
```bash 
npm run build
```


