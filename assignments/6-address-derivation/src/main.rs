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
    
    let mnemonic = Mnemonic::generate_in_with(&mut rng, Language::English, 15).expect("failed to generate mnemonic");
    println!("");
    println!("Mnemonic phrase");
    println!("===============");
    println!("{}", mnemonic); 
    println!("");
    let seed = mnemonic.to_seed("");
    
    


    for i in 0..5{
        let derivation_path = format!("m/44'/60'/0'/0/{}", i);

        let child_key = ExtendedPrivKey::derive(seed.as_slice(), &*derivation_path).expect("Derivation failed");
    
        let raw_prv = child_key.secret();
        let signing_key = SigningKey::from_slice(&child_key.secret())
            .expect("Invalid private key");
    
        let public_key = signing_key.verifying_key();
        let encoded = public_key.to_encoded_point(false);
        let pubkey_bytes = encoded.as_bytes();
        let pubkey = &pubkey_bytes[1..];
    
        let hash = Keccak256::digest(pubkey);
        let address = &hash[12..];


        println!("");
        println!("WALLET {}", i+1);
        println!("Derivation path: {}", derivation_path);
        println!("Private key in hex(before signing key): {}", hex::encode(raw_prv));
        println!("Public Key in hex: {}", hex::encode(pubkey));
        println!("Address: 0x{}", hex::encode(address));
        println!("");    
    }


}








////////////LEARNING

// fn main() {
//     // 1️⃣ Generate a mnemonic
//     let mut rng = OsRng;
//     let mnemonic = Mnemonic::generate_in_with(&mut rng, Language::English, 12).unwrap();
//     println!("Mnemonic: {}", mnemonic);

//     let seed = mnemonic.to_seed("");

//     // 2️⃣ Derive two keys with different derivation paths
//     let key0 = ExtendedPrivKey::derive(seed.as_slice(), "m/44'/60'/0'/0/0").unwrap();
//     let key1 = ExtendedPrivKey::derive(seed.as_slice(), "m/44'/60'/0'/0/0").unwrap();

//     // 3️⃣ Convert each to Ethereum address
//     let addr0 = private_key_to_eth_address(&key0);
//     let addr1 = private_key_to_eth_address(&key1);

//     println!("Address 0: 0x{}", hex::encode(addr0));
//     println!("Address 1: 0x{}", hex::encode(addr1));
// }

// // Helper function to convert ExtendedPrivKey → Ethereum address
// fn private_key_to_eth_address(key: &ExtendedPrivKey) -> [u8; 20] {
//     let signing_key = SigningKey::from_slice(&key.secret()).unwrap();
//     let pubkey = signing_key.verifying_key().to_encoded_point(false);
//     let pubkey_bytes = pubkey.as_bytes();
//     let pubkey_no_prefix = &pubkey_bytes[1..]; // remove 0x04 prefix
//     let hash = Keccak256::digest(pubkey_no_prefix);
//     let mut address = [0u8; 20];
//     address.copy_from_slice(&hash[12..]); // last 20 bytes
//     address
// }