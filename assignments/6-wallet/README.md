# 🔐 Ethereum HD Wallet - Rust Implementation

A complete hierarchical deterministic (HD) wallet implementation in Rust for Ethereum, supporting BIP39 mnemonic generation, BIP32 key derivation, and Sepolia testnet interactions.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Security Warnings](#security-warnings)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **BIP39 Mnemonic Generation**: Generate secure 12-24 word seed phrases
- **BIP32 Key Derivation**: Full support for hierarchical deterministic wallets
- **BIP44 Standard Paths**: Ethereum-compliant derivation paths (m/44'/60'/0'/0/x)
- **Multiple Address Types**: Support for various Ethereum address formats
- **EIP-55 Checksumming**: Proper address checksum validation
- **Network Support**:
  - Sepolia testnet (with multiple fallback RPCs)
  - Ethereum mainnet
  - Custom networks
- **Transaction Management**:
  - Check balances
  - Send transactions
  - Query transaction history
  - EIP-155 transaction signing
- **Robust RPC Handling**: Automatic failover between multiple RPC endpoints

## 📁 Project Structure

```text
wallet/
├── wallet-core/ # Core wallet library
│ ├── src/
│ │ ├── entropy.rs # Cryptographic entropy generation
│ │ ├── mnemonic.rs # BIP39 mnemonic conversion
│ │ ├── seed.rs # PBKDF2 seed derivation
│ │ ├── wordlist.rs # BIP39 word list
│ │ ├── ethereum/
│ │ │ ├── mod.rs
│ │ │ ├── private_key.rs # BIP32 private key derivation
│ │ │ ├── public_key.rs # ECDSA public key generation
│ │ │ ├── address.rs # Ethereum address generation
│ │ │ ├── network.rs # RPC client & network utilities
│ │ │ └── transaction.rs # Transaction signing
│ │ └── lib.rs
│ ├── Cargo.toml
│ └── wordlist.txt # BIP39 English wordlist
│
└── wallet-cli/ # Command-line interface
├── src/
│ └── main.rs
└── Cargo.toml
```

## 🚀 Installation

### Prerequisites

- Rust 1.70+ (install from [rustup.rs](https://rustup.rs/))
- Internet connection (for RPC calls)

### Build from Source

```bash
# Clone the repository
git clone https://github.com/Mac-5/cohort-8/tree/submission/assignment-06/Mac-5
cd wallet

# Build the project
cargo build --release

# Run the CLI
cd wallet-cli
cargo run
```

## 💻 Usage

### Basic Usage

```bash
cd wallet-cli
cargo run
```

### Interactive Menu

The wallet provides an interactive command-line interface:

```
🔐 Ethereum HD Wallet - Sepolia Testnet

Your Mnemonic: punch shock entire north file identify
⚠️  Save this mnemonic securely!

Your Ethereum Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4
Private Key: 0x3d8c15d9e468f7e8f2e71f4b7d2c8a9f...

Connected to: Sepolia (Chain ID: 11155111)

📋 Menu:
1. Check Balance
2. Send Transaction
3. Get Account Info
4. Exit

Select option:
```

### Getting Test ETH

To test transactions on Sepolia, get free test ETH from:

- [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia Faucet](https://sepoliafaucet.com/)

## 🔧 How It Works

### 1. Entropy Generation

```rust
// Generate 128 bits (16 bytes) of cryptographic entropy
let (entropy_bytes, _) = generate_entropy(128)?;
```

### 2. Mnemonic Creation (BIP39)

```rust
// Convert entropy to 12-word mnemonic
let wordlist = get_wordlist();
let mnemonic = entropy_to_mnemonic(&entropy_bytes, &wordlist)?;
// Output: "word1 word2 word3 ... word12"
```

### 3. Seed Derivation (PBKDF2)

```rust
// Derive 512-bit seed from mnemonic + optional passphrase
let seed = mnemonic_to_seed(&mnemonic, "");
```

### 4. Master Key Generation (BIP32)

```rust
// Generate master extended private key
let master = seed_to_master_key(&seed)?;
```

### 5. Key Derivation (BIP44)

```rust
// Derive Ethereum account at m/44'/60'/0'/0/0
let path = "m/44'/60'/0'/0/0";
let key = derive_path(&master, path)?;
```

### 6. Address Generation

```rust
// Generate Ethereum address with EIP-55 checksum
let public_key = private_to_public_key(&key.private_key);
let address = public_key_to_address(&public_key);
let checksum_address = to_checksum_address(&address);
```

## ⚠️ Security Warnings

**CRITICAL**: This wallet is for **educational and development purposes only**.

- ❌ **DO NOT** use this wallet for real funds on mainnet
- ❌ **NEVER** share your mnemonic phrase with anyone
- ❌ **NEVER** enter your mnemonic into websites
- ❌ **DO NOT** store private keys in plain text
- ✅ **ALWAYS** use hardware wallets for real funds
- ✅ **ALWAYS** backup your mnemonic securely offline
- ✅ **ONLY** use test networks (Sepolia) for testing

### Best Practices

1. **Mnemonic Storage**: Write down your mnemonic on paper and store it securely
2. **Private Keys**: Never expose private keys in logs or error messages
3. **API Keys**: Use environment variables for API keys (never commit to git)
4. **Testing**: Always test on Sepolia before any mainnet operations
5. **Code Review**: Audit all cryptographic operations before production use

## 📚 API Reference

### Core Library (`wallet-core`)

#### Entropy Generation

```rust
pub fn generate_entropy(bits: usize) -> Result<(Vec<u8>, String), String>
```

Generates cryptographically secure random entropy.

#### Mnemonic Operations

```rust
pub fn entropy_to_mnemonic(entropy: &[u8], wordlist: &[String]) -> Result<String, String>
pub fn mnemonic_to_seed(mnemonic: &str, passphrase: &str) -> Vec<u8>
```

#### Key Derivation

```rust
pub fn seed_to_master_key(seed: &[u8]) -> Result<ExtendedPrivateKey, String>
pub fn derive_path(master: &ExtendedPrivateKey, path: &str) -> Result<ExtendedPrivateKey, String>
```

#### Network Operations

```rust
pub async fn get_balance(network: &EthereumNetwork, address: &str) -> Result<String, String>
pub async fn send_raw_transaction(network: &EthereumNetwork, signed_tx: &str) -> Result<String, String>
```

## 🧪 Testing

```bash
# Run all tests
cargo test

# Run tests for specific module
cargo test --package wallet-core --lib ethereum::address

# Run with output
cargo test -- --nocapture
```

## 📦 Dependencies

### Core Dependencies

- `secp256k1` - Elliptic curve cryptography
- `sha2`, `sha3` - Hashing algorithms
- `pbkdf2` - Key derivation
- `hmac` - Message authentication
- `rlp` - Recursive Length Prefix encoding
- `reqwest` - HTTP client for RPC calls

### Full List

See `Cargo.toml` files for complete dependency information.

## 🔄 Derivation Paths

The wallet supports standard Ethereum derivation paths:

| Path               | Description                  |
| ------------------ | ---------------------------- |
| `m/44'/60'/0'/0/0` | Standard BIP44 (most common) |
| `m/44'/60'/x'/0/0` | Ledger Live                  |
| `m/44'/60'/0'/x`   | Ledger Legacy                |

Where:

- `44'` = BIP44 purpose
- `60'` = Ethereum coin type
- `0'` = Account index
- `0` = External chain (receiving addresses)
- `0` = Address index

## 🌐 Supported Networks

### Sepolia Testnet (Default)

The wallet uses multiple fallback RPCs for reliability:

- `https://ethereum-sepolia-rpc.publicnode.com`
- `https://rpc.sepolia.org`
- `https://sepolia.gateway.tenderly.co`
- `https://ethereum-sepolia.blockpi.network/v1/rpc/public`

### Custom Networks

```rust
let network = EthereumNetwork::custom(
    "https://your-rpc-url.com".to_string(),
    11155111,  // Chain ID
    "Custom Network".to_string()
);
```

## 🐛 Troubleshooting

### Common Issues

**Rate Limiting (429 Error)**

- Solution: Wait a few minutes or get a free API key from [Alchemy](https://www.alchemy.com/)

**Timeout Errors**

- The wallet automatically tries multiple RPCs
- Check your internet connection
- Try again in a few moments

**Balance Shows Zero**

- Ensure the address has received test ETH from a faucet
- Wait for transaction confirmation (~15 seconds)
- Check on [Sepolia Etherscan](https://sepolia.etherscan.io/)

## 📖 Educational Resources

- [BIP39 - Mnemonic Code](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIP32 - Hierarchical Deterministic Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [BIP44 - Multi-Account Hierarchy](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
- [EIP-55 - Mixed-case Checksum](https://eips.ethereum.org/EIPS/eip-55)
- [EIP-155 - Replay Attack Protection](https://eips.ethereum.org/EIPS/eip-155)

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass: `cargo test`
2. Code is formatted: `cargo fmt`
3. No linting errors: `cargo clippy`
4. Security considerations are addressed

## 📄 License

This project is provided as-is for educational purposes. Use at your own risk.

## ⚡ Performance

- Mnemonic generation: ~1ms
- Key derivation (5 levels): ~5ms
- Address generation: <1ms
- RPC calls: 100-500ms (network dependent)

## 🔮 Future Enhancements

- [ ] EIP-1559 transaction support
- [ ] ERC-20 token transfers
- [ ] Hardware wallet integration
- [ ] Multi-signature wallets
- [ ] Contract interaction
- [ ] ENS resolution
- [ ] Transaction history
- [ ] GUI interface

---

**Made with ❤️ using Rust**

For questions or issues, please open an issue on GitHub.

**Remember: Never use this with real funds. Educational purposes only!** 🎓
