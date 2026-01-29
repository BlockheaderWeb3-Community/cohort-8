use bip39::rand::RngCore;
use bip39::{Language, Mnemonic};
use bip39::rand::rngs::OsRng;

use tiny_hderive::bip32::ExtendedPrivKey;

use k256::ecdsa::SigningKey;
use k256::elliptic_curve::sec1::ToEncodedPoint;
use k256::elliptic_curve::FieldBytes;

use sha3::{Digest, Keccak256};


fn main() {
    let mut rng = OsRng;  
    
    let mut array = [0u8; 12];
    OsRng.fill_bytes(&mut array);
    println!("Entropy: {:?}", array);

    let mnemonic = Mnemonic::generate_in_with(&mut rng, Language::English, 12).expect("failed to generate mnemonic");
    println!("Mnemonic phrase");
    println!("{}", mnemonic); 

    
    let entropy = mnemonic.to_entropy();
    println!("Entropy (hex): {}", hex::encode(entropy));
    

    let seed = mnemonic.to_seed("");

    let child_key = ExtendedPrivKey::derive(seed.as_slice(),"m/44'/60'/0'/0/0").expect("Derivation failed");

    let signing_key = SigningKey::from_slice(&child_key.secret())
        .expect("Invalid private key");

    let public_key = signing_key.verifying_key();
    let encoded = public_key.to_encoded_point(false);
    let pubkey_bytes = encoded.as_bytes();
    let pubkey = &pubkey_bytes[1..];

    let hash = Keccak256::digest(pubkey);
    let address = &hash[12..];

    println!("Ethereum address: 0x{}", hex::encode(address));
}