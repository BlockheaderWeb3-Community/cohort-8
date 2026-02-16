use secp256k1::{Secp256k1, SecretKey};

/// Convert private key to uncompressed public key (64 bytes, without 0x04 prefix)
pub fn private_to_public_key(private_key: &[u8; 32]) -> [u8; 64] {
    let secp = Secp256k1::new();
    let secret_key = SecretKey::from_slice(private_key).expect("Valid private key");
    let public_key = secret_key.public_key(&secp);

    // Get uncompressed public key (65 bytes: 0x04 || x || y)
    let uncompressed = public_key.serialize_uncompressed();

    // Remove the 0x04 prefix, return only x and y coordinates (64 bytes)
    let mut result = [0u8; 64];
    result.copy_from_slice(&uncompressed[1..]);
    result
}

/// Get compressed public key (33 bytes)
pub fn get_compressed_public_key(private_key: &[u8; 32]) -> [u8; 33] {
    let secp = Secp256k1::new();
    let secret_key = SecretKey::from_slice(private_key).expect("Valid private key");
    let public_key = secret_key.public_key(&secp);

    let mut result = [0u8; 33];
    result.copy_from_slice(&public_key.serialize());
    result
}

/// Display public key information
pub fn display_public_key(private_key: &[u8; 32], path: &str) {
    let public_key = private_to_public_key(private_key);
    let compressed = get_compressed_public_key(private_key);

    let separator = "=".repeat(70);
    println!("{}", separator);
    println!("Public Key for path: {}", path);
    println!("{}", separator);
    println!("Public Key (uncompressed): 0x{}", hex::encode(public_key));
    println!("Public Key (compressed):   0x{}", hex::encode(compressed));
    println!();
}
