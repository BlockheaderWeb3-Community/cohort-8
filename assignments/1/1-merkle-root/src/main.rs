use std::{hash, io};

use ethers::utils::{hex};
use sha2::{Sha256, Digest};
use sha3::Keccak256;
// use sha3::{Keccak256};

struct Transaction {
    tx: String
}

// #[derive(Debug, Clone, Copy)]
impl Transaction {
    fn new(metadata: &str) -> Self {
        Self { 
            tx: String::from(metadata) 
        }
    }
}

fn main() {

    let tx1 = Transaction::new("Alice sent 2 eth");
    let tx2 = Transaction::new("Jacks sent 1 eth");
    let tx3 = Transaction::new("Mike sent 8 eth");
    let tx4 = Transaction::new("Richard sent 2 eth");
    let tx5 = Transaction::new("Key sent 2 eth");

    
    print!(" 1 => Proceed   ");
    print!("      2 => Concatenate Transactions");
    println!("");
    println!("This is Block #10290, please validate transactions");
    let mut trxn_input = String::new();
    io::stdin().read_line(&mut trxn_input).expect("Failed to read this line");
    
    let mut txns = vec![tx1, tx2, tx3, tx4, tx5];
    let mut hashed_trxn = Vec::new();

    for i in txns.iter_mut(){
        let mut hash = Sha256::new();
        hash.update(i.tx.clone());
        let result = hash.finalize().to_vec();
        hashed_trxn.push(result);
    }

    for hash in hashed_trxn.iter() {
        println!("{:?}", hex::encode(hash));
    }


    let sha256_root = get_merkle_root_through_sha256(hashed_trxn.clone());
    // let Keccak256_root = get_merkle_root_through_kecheck(hashed_trxn);

    println!(""); 
    println!("Merkel root using sha256: ___ {}", hex::encode(sha256_root));
    // println!("Merkel root using keccak256: ___ {}", hex::encode(Keccak256_root));
}


fn get_merkle_root_through_sha256(mut hashes: Vec<Vec<u8>>) -> Vec<u8> {

    println!("");
    println!("Using Sha256");
    if hashes.is_empty(){
        return vec![]
    }
    
    
    while hashes.len() > 1{
        let mut next_level = Vec::new();
        
        let mut i = 0;

        println!("");
        println!("CURRENT LEVEL");
        for (i, h) in hashes.iter().enumerate(){
            println!("Transaction {}: {}", i, hex::encode(h))
        }

        while i < hashes.len() {

            if i + 1 < hashes.len() {

            println!("");
            println!("Hashing ==[{}
            || {}]==", hex::encode(hashes[i].clone()), hex::encode(hashes[i + 1].clone()));

                let mut hasher = Sha256::new();
                hasher.update(&hashes[i]);
                hasher.update(&hashes[i + 1]);
                let result: Vec<u8> = hasher.finalize().to_vec();
                println!("");
                println!("Result: {}", hex::encode(&result));
                next_level.push(result);
            }else {
                println!("Unlinked hash: {}", hex::encode(hashes[i].clone()));
                next_level.push(hashes[i].clone());
            }
            
            i += 2;
        }
        hashes = next_level;
    }

    hashes.pop().unwrap()


}

fn get_merkle_root_through_kecheck(mut hashes: Vec<Vec<u8>>) -> Vec<u8> {
    println!("");
    println!("Using Keccak256");
  if hashes.is_empty(){
        return vec![]
    }
    
    
    while hashes.len() > 1{
        let mut next_level = Vec::new();
        
        let mut i = 0;

        println!("");
        println!("CURRENT LEVEL");
        for (i, h) in hashes.iter().enumerate(){
            println!("Transaction {}: {}", i, hex::encode(h))
        }

        while i < hashes.len() {

            if i + 1 < hashes.len() {

            println!("");
            println!("Hashing ==[{}
            || {}]==", hex::encode(hashes[i].clone()), hex::encode(hashes[i + 1].clone()));

                let mut hasher = Keccak256::new();
                hasher.update(&hashes[i]);
                hasher.update(&hashes[i + 1]);
                let result: Vec<u8> = hasher.finalize().to_vec();
                println!("");
                println!("Result: {}", hex::encode(&result));
                next_level.push(result);
            }else {
                next_level.push(hashes[i].clone());
            }
            
            i += 2;
        }
        hashes = next_level;
    }

    hashes.pop().unwrap()

}
