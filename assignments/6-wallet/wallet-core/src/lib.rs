pub mod entropy;
pub mod ethereum;
pub mod mnemonic;
pub mod seed;
pub mod wordlist;

// Re-export main functions
pub use entropy::generate_entropy;
pub use mnemonic::entropy_to_mnemonic;
pub use seed::{mnemonic_to_seed, seed_to_hex};
pub use wordlist::get_wordlist;

// Re-export Ethereum module
pub use ethereum::{
    create_signed_transaction, derive_path, display_address, display_private_key,
    display_public_key, eth_to_wei, get_balance, get_gas_price, get_transaction_count,
    private_to_public_key, public_key_to_address, seed_to_master_key, send_raw_transaction,
    to_checksum_address, wei_to_eth, EthereumNetwork, ExtendedPrivateKey,
};
