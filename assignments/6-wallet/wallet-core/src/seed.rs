use pbkdf2::pbkdf2_hmac;
use sha2::Sha512;

// Derive a seed from a mnemonic and optional passphrase using PBKDF2 with HMAC-SHA512

pub fn mnemonic_to_seed(mnemonic: &str, passphrase: &str) -> Vec<u8> {
    println!("passphrase: {}", passphrase);

    let password = mnemonic.as_bytes();
    let salt = format!("mnemonic{}", passphrase);
    let salt_bytes = salt.as_bytes();

    let iterations = 2048;
    let key_length = 64; // 512 bits

    let mut seed = vec![0u8; key_length];
    pbkdf2_hmac::<Sha512>(password, salt_bytes, iterations, &mut seed);
    seed
}

pub fn seed_to_hex(seed: &[u8]) -> String {
    hex::encode(seed)
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mnemonic_to_seed() {
        let mnemonic = "punch shock entire north file identify";
        let passphrase = "";

        let seed = mnemonic_to_seed(mnemonic, passphrase);
        let seed_hex = seed_to_hex(&seed);

        assert_eq!(seed.len(), 64);
        assert_eq!(seed_hex.len(), 128); // 64 bytes = 128 hex chars

        // Known test vector
        let expected = "e1ca8d8539fb054eda16c35dcff74c5f88202b88cb03f2824193f4e6c5e87dd2e24a0edb218901c3e71e900d95e9573d9ffbf870b242e927682e381d109ae882";
        assert_eq!(seed_hex, expected);
    }

    #[test]
    fn test_with_passphrase() {
        let mnemonic = "punch shock entire north file identify";
        let passphrase = "my secret passphrase";

        let seed = mnemonic_to_seed(mnemonic, passphrase);
        assert_eq!(seed.len(), 64);

        // Different passphrase should produce different seed
        let seed2 = mnemonic_to_seed(mnemonic, "different passphrase");
        assert_ne!(seed, seed2);
    }
}
