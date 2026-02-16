use rand::RngCore;

//Generate cryptographic entropy

pub fn generate_entropy(bits: usize) -> Result<(Vec<u8>, String), String> {
    if bits % 8 != 0 {
        return Err("Bits must be a multiple of 8".to_string());
    }
    let bytes_count = bits / 8;
    let mut bytes = vec![0u8; bytes_count];

    //Generate cryptographic random bytes
    rand::thread_rng().fill_bytes(&mut bytes);

    let entropy: String = bytes.iter().map(|byte| format!("{:08b}", byte)).collect();
    println!("Generated entropy: {}", entropy);
    Ok((bytes, entropy))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_128_bits() {
        let (bytes, entropy) = generate_entropy(128).unwrap();
        assert_eq!(bytes.len(), 16);
        assert_eq!(entropy.len(), 128);
    }
    #[test]
    fn test_generate_256_bits() {
        let (bytes, entropy) = generate_entropy(256).unwrap();
        assert_eq!(bytes.len(), 32);
        assert_eq!(entropy.len(), 256);
    }
}
