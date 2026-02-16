use sha3::{Digest, Keccak256};

/// Generate Ethereum address from public key
/// Ethereum address = last 20 bytes of Keccak256(public_key)
pub fn public_key_to_address(public_key: &[u8; 64]) -> String {
    // Keccak256 hash of the public key
    let hash = Keccak256::digest(public_key);

    // Take last 20 bytes
    let address_bytes = &hash[12..32];

    // Convert to hex with 0x prefix
    format!("0x{}", hex::encode(address_bytes))
}

/// Generate checksummed Ethereum address (EIP-55)
pub fn to_checksum_address(address: &str) -> String {
    // Remove 0x prefix if present
    let address = address.trim_start_matches("0x").to_lowercase();

    // Hash the lowercase address
    let hash = Keccak256::digest(address.as_bytes());
    let hash_hex = hex::encode(hash);

    let mut checksummed = String::from("0x");

    for (i, ch) in address.chars().enumerate() {
        if ch.is_numeric() {
            checksummed.push(ch);
        } else {
            // If the corresponding hex digit is >= 8, capitalize
            let hash_char = hash_hex.chars().nth(i).unwrap();
            if hash_char >= '8' {
                checksummed.push(ch.to_uppercase().next().unwrap());
            } else {
                checksummed.push(ch);
            }
        }
    }

    checksummed
}

/// Display Ethereum address
pub fn display_address(public_key: &[u8; 64], path: &str) {
    let address = public_key_to_address(public_key);
    let checksum_address = to_checksum_address(&address);

    let separator = "=".repeat(70);
    println!("{}", separator);
    println!("Ethereum Address for path: {}", path);
    println!("{}", separator);
    println!("Address:           {}", address);
    println!("Checksum Address:  {}", checksum_address);
    println!();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_checksum_address() {
        let address = "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed";
        let checksummed = to_checksum_address(address);
        assert_eq!(checksummed, "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed");
    }

    #[test]
    fn test_public_key_to_address() {
        // Test with a known public key
        let public_key = [0u8; 64]; // Example public key
        let address = public_key_to_address(&public_key);

        // Address should start with 0x and be 42 characters long
        assert!(address.starts_with("0x"));
        assert_eq!(address.len(), 42);
    }

    #[test]
    fn test_checksum_mixed_case() {
        let lowercase = "0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed";
        let checksummed = to_checksum_address(lowercase);
        assert_eq!(checksummed, "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed");

        // Test with uppercase input
        let uppercase = "0x5AAEB6053F3E94C9B9A09F33669435E7EF1BEAED";
        let checksummed2 = to_checksum_address(uppercase);
        assert_eq!(checksummed2, "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed");
    }
}
