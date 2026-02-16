pub const WORDLIST: &str = include_str!("../wordList.txt");

/// Get wordlist as a vector of strings
pub fn get_wordlist() -> Vec<String> {
    WORDLIST
        .lines()
        .map(|line| line.trim().to_string())
        .collect()
}
