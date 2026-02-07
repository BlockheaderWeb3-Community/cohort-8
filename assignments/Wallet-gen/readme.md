# Ethereum HD Wallet Generator 

A secure, deterministic Ethereum wallet generator implementing BIP-39, BIP-32, and BIP-44 standards. Generate and manage hierarchical deterministic Ethereum wallets from a single seed phrase.

## **SECURITY WARNING**

**NEVER USE THIS WITH REAL FUNDS IN ONLINE ENVIRONMENTS!**
- This tool should only be used in secure, offline, air-gapped computers
- Your seed phrase grants complete control over all derived wallets
- Compromising your seed phrase means **permanent loss of all funds**

## Features

- ✅ **BIP-39**: Generate 12/24-word mnemonic phrases with checksum
- ✅ **BIP-32**: Hierarchical Deterministic (HD) wallet structure
- ✅ **BIP-44**: Multi-account hierarchy for Ethereum (`m/44'/60'/0'/0/0`)
- ✅ **Secure Entropy**: Cryptographically secure random number generation
- ✅ **Seed Derivation**: PBKDF2 with 2048 iterations and optional passphrase
- ✅ **Multiple Addresses**: Derive unlimited addresses from single seed
- ✅ **EIP-55**: Checksum-encoded Ethereum addresses
- ✅ **CLI & Programmable API**: Both command-line and JavaScript APIs



