# Ethereum Address Generation Flow

This project demonstrates the fundamental steps involved in generating an Ethereum address, starting from entropy and ending with a valid wallet address.


An Ethereum address is derived through a series of cryptographic transformations. Each step plays a critical role in ensuring security, determinism, and uniqueness.

## Address Generation Pipeline

Entropy
→ Mnemonic Phrase
→ Seed
→ Private Key (256-bit number)
→ secp256k1 (ECDSA)
→ Public Key (512-bit / 128-character)
→ Keccak-256 Hashing
→ Address (last 20 bytes / 40 hexadecimal characters)


## Step-by-Step Explanation

### 1. Entropy
Entropy is a source of randomness. It is used as the foundation for generating secure keys.

### 2. Mnemonic Phrase
The entropy is converted into a human-readable mnemonic phrase (usually 12 or 24 words) following the BIP-39 standard.  
This phrase allows users to back up and restore their wallets.

### 3. Seed
The mnemonic phrase is transformed into a binary seed using a key-stretching function.  
This seed is the root for generating private keys.

### 4. Private Key (256-bit)
A private key is derived from the seed.  
It is a 256-bit number and must be kept secret, as it controls access to funds.

### 5. secp256k1 (ECDSA)
Using the Elliptic Curve Digital Signature Algorithm (ECDSA) on the secp256k1 curve, the private key is mathematically transformed into a public key.

### 6. Public Key (512-bit)
The resulting public key is 512 bits long (128 hexadecimal characters).  
This key can be shared publicly and is used to derive the address.

### 7. Keccak-256 Hashing
The public key is hashed using the Keccak-256 cryptographic hash function.

### 8. Ethereum Address
The Ethereum address is obtained by taking the **last 20 bytes** of the hash result.  
This produces a **40-character hexadecimal string**, which is typically prefixed with `0x`.
