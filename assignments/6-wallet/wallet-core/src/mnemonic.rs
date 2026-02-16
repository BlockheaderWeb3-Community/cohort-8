use sha2::{Digest, Sha256};

pub fn entropy_to_mnemonic(entropy_bytes: &[u8], word_list: &[String]) -> Result<String, String> {
    //Validate entropy length
    let valid_length = [16, 20, 24, 28, 32];
    if !valid_length.contains(&entropy_bytes.len()) {
        return Err(format!(
            "Invalid entropy length: {} bytes. Must be 16, 20, 24, 28, 32",
            entropy_bytes.len()
        ));
    }

    if word_list.len() != 2048 {
        return Err("Word list must contain exactly 2048 words".to_string());
    }
    //convert entropy to binary string
    let entropy_bits: String = entropy_bytes
        .iter()
        .map(|byte| format!("{:08b}", byte))
        .collect();
    //Calculate checksum
    let mut hasher = Sha256::new();
    hasher.update(entropy_bytes);
    let hash = hasher.finalize();

    let checksum_size = entropy_bytes.len() / 4;
    let checksum: String = hash
        .iter()
        .take((checksum_size + 7) / 8)
        .map(|byte| format!("{:08b}", byte))
        .collect::<String>()
        .chars()
        .take(checksum_size)
        .collect();

    println!("Checksum: {}", checksum);
    //Combine entropy + checksum
    let full = format!("{}{}", entropy_bits, checksum);
    println!("combined: {}", full);
    let pieces: Vec<&str> = full
        .as_bytes()
        .chunks(11)
        .map(|chunk| std::str::from_utf8(chunk).unwrap())
        .collect();

    //
    println!("words:");
    let mut sentence = Vec::new();

    for piece in pieces {
        //convert 11-bit binary string to decimal
        let index = usize::from_str_radix(piece, 2)
            .map_err(|e| format!("Failed to parse binary string: {}", e))?;
        if index >= word_list.len() {
            return Err(format!("Index out of bounds: {}", index));
        }
        let word = &word_list[index];
        sentence.push(word.clone());
        println!("{} {:>4} {}", piece, index, word);
    }
    let mnemonic = sentence.join(" ");
    Ok(mnemonic)
}

pub fn load_wordlist(path: &str) -> Result<Vec<String>, std::io::Error> {
    let content = std::fs::read_to_string(path)?;
    let words: Vec<String> = content
        .lines()
        .map(|line| line.trim().to_string())
        .collect();
    Ok(words)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_checksum_length() {
        let entropy_16 = vec![0u8; 16];
        let entropy_32 = vec![0u8; 32];

        assert_eq!(entropy_16.len() / 4, 4);
        assert_eq!(entropy_32.len() / 4, 8);
    }
}
