pub mod address;
pub mod network;
pub mod private_key;
pub mod public_key;
pub mod transaction;

pub use address::{display_address, public_key_to_address, to_checksum_address};
pub use network::{
    eth_to_wei, get_balance, get_gas_price, get_transaction_count, send_raw_transaction,
    wei_to_eth, EthereumNetwork,
};
pub use private_key::{derive_path, display_private_key, seed_to_master_key, ExtendedPrivateKey};
pub use public_key::{display_public_key, private_to_public_key};
pub use transaction::create_signed_transaction;

/// Standard Ethereum derivation paths
pub mod paths {
    /// BIP44 Ethereum mainnet: m/44'/60'/0'/0/0
    pub const ETHEREUM_MAINNET: &str = "m/44'/60'/0'/0";

    /// Ledger Live Ethereum: m/44'/60'/0'/0/0
    pub const LEDGER_LIVE: &str = "m/44'/60'/0'/0";

    /// Legacy Ledger: m/44'/60'/0'/0
    pub const LEDGER_LEGACY: &str = "m/44'/60'/0'";
}
