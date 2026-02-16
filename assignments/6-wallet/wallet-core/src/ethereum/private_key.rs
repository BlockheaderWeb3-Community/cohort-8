use hmac::{Hmac, Mac};
use secp256k1::{Secp256k1, SecretKey};
use sha2::Sha512;

type HmacSha512 = Hmac<Sha512>;

const HARDENED_OFFSET: u32 = 0x80000000; // 2^31

/// Extended Private Key structure for Ethereum
#[derive(Debug, Clone)]
pub struct ExtendedPrivateKey {
    pub private_key: [u8; 32],
    pub chain_code: [u8; 32],
    pub depth: u8,
    pub parent_fingerprint: [u8; 4],
    pub child_number: u32,
}

/// Generate master extended private key from seed
pub fn seed_to_master_key(seed: &[u8]) -> Result<ExtendedPrivateKey, String> {
    if seed.len() < 16 || seed.len() > 64 {
        return Err(format!(
            "Seed must be between 16 and 64 bytes, got {}",
            seed.len()
        ));
    }

    // HMAC-SHA512 with key "Bitcoin seed" (same for Ethereum)
    let mut mac =
        HmacSha512::new_from_slice(b"Bitcoin seed").map_err(|e| format!("HMAC error: {}", e))?;
    mac.update(seed);
    let result = mac.finalize().into_bytes();

    let mut private_key = [0u8; 32];
    let mut chain_code = [0u8; 32];

    private_key.copy_from_slice(&result[0..32]);
    chain_code.copy_from_slice(&result[32..64]);

    Ok(ExtendedPrivateKey {
        private_key,
        chain_code,
        depth: 0,
        parent_fingerprint: [0u8; 4],
        child_number: 0,
    })
}

/// Derive a child extended private key
pub fn derive_private_child(
    parent: &ExtendedPrivateKey,
    child_number: u32,
) -> Result<ExtendedPrivateKey, String> {
    let hardened = child_number >= HARDENED_OFFSET;

    let mut mac =
        HmacSha512::new_from_slice(&parent.chain_code).map_err(|e| format!("HMAC error: {}", e))?;

    if hardened {
        // Hardened child: HMAC-SHA512(chain_code, 0x00 || private_key || child_number)
        mac.update(&[0x00]);
        mac.update(&parent.private_key);
    } else {
        // Non-hardened child: HMAC-SHA512(chain_code, public_key || child_number)
        let public_key = private_key_to_public_key(&parent.private_key);
        mac.update(&public_key);
    }

    mac.update(&child_number.to_be_bytes());
    let result = mac.finalize().into_bytes();

    // Parse IL and IR
    let mut il = [0u8; 32];
    let mut chain_code = [0u8; 32];
    il.copy_from_slice(&result[0..32]);
    chain_code.copy_from_slice(&result[32..64]);

    // Calculate child private key: (IL + parent_key) mod n
    let child_private_key = add_private_keys(&il, &parent.private_key)?;

    // Calculate parent fingerprint
    let parent_public_key = private_key_to_public_key(&parent.private_key);
    let parent_fingerprint = keccak256_fingerprint(&parent_public_key);

    Ok(ExtendedPrivateKey {
        private_key: child_private_key,
        chain_code,
        depth: parent.depth + 1,
        parent_fingerprint,
        child_number,
    })
}

/// Derive a key using a full derivation path
/// Ethereum standard: m/44'/60'/0'/0/0
pub fn derive_path(master: &ExtendedPrivateKey, path: &str) -> Result<ExtendedPrivateKey, String> {
    // Remove "m/" or "m" prefix
    let path = path.trim_start_matches("m/").trim_start_matches("m");

    if path.is_empty() {
        return Ok(master.clone());
    }

    let mut current = master.clone();

    for segment in path.split('/') {
        let (index_str, hardened) = if segment.ends_with('\'') || segment.ends_with('h') {
            (&segment[..segment.len() - 1], true)
        } else {
            (segment, false)
        };

        let index: u32 = index_str
            .parse()
            .map_err(|_| format!("Invalid path segment: {}", segment))?;

        let child_number = if hardened {
            HARDENED_OFFSET + index
        } else {
            index
        };

        current = derive_private_child(&current, child_number)?;
    }

    Ok(current)
}

/// Convert private key to compressed public key (33 bytes)
fn private_key_to_public_key(private_key: &[u8; 32]) -> [u8; 33] {
    let secp = Secp256k1::new();
    let secret_key = SecretKey::from_slice(private_key).expect("Valid private key");
    let public_key = secret_key.public_key(&secp);

    let mut result = [0u8; 33];
    result.copy_from_slice(&public_key.serialize());
    result
}

/// Add two private keys modulo the secp256k1 curve order
fn add_private_keys(a: &[u8; 32], b: &[u8; 32]) -> Result<[u8; 32], String> {
    let _secp = Secp256k1::new();
    let mut key_a = SecretKey::from_slice(a).map_err(|_| "Invalid key a")?;
    let key_b = SecretKey::from_slice(b).map_err(|_| "Invalid key b")?;

    key_a = key_a
        .add_tweak(&key_b.into())
        .map_err(|_| "Failed to add keys")?;

    Ok(key_a.secret_bytes())
}

/// Calculate Keccak256 fingerprint (first 4 bytes)
fn keccak256_fingerprint(public_key: &[u8; 33]) -> [u8; 4] {
    use sha3::{Digest, Keccak256};

    let hash = Keccak256::digest(public_key);
    let mut fingerprint = [0u8; 4];
    fingerprint.copy_from_slice(&hash[0..4]);
    fingerprint
}

/// Display private key information
pub fn display_private_key(key: &ExtendedPrivateKey, path: &str) {
    let separator = "=".repeat(70);
    println!("{}", separator);
    println!("Private Key for path: {}", path);
    println!("{}", separator);
    println!("Private Key (hex):  0x{}", hex::encode(key.private_key));
    println!("Chain Code:         {}", hex::encode(key.chain_code));
    println!("Depth:              {}", key.depth);
    println!("Child Number:       {}", key.child_number);
    println!();
}
