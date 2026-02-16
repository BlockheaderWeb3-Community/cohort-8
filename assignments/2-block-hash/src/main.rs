use rlp::RlpStream;
use ethereum_types::{H256, U256, Address};
use tiny_keccak::{Hasher, Keccak};
use sha2::{Sha256, Digest};
use colored::*;

fn keccak256(data: &[u8]) -> [u8; 32] {
    let mut hasher = Keccak::v256();
    let mut output = [0u8; 32];
    hasher.update(data);
    hasher.finalize(&mut output);
    output
}

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

fn ethereum_block_hash() -> H256 {
      let tx1 = Transaction::new("Alice sent 2 eth");
    let tx2 = Transaction::new("Jacks sent 1 eth");
    let tx3 = Transaction::new("Mike sent 8 eth");
    let tx4 = Transaction::new("Richard sent 2 eth");
    let tx5 = Transaction::new("Key sent 2 eth");

    let mut txns = vec![tx1, tx2, tx3, tx4, tx5];
    let mut hashed_trxn = Vec::new();

    for i in txns.iter_mut(){
        let mut hash = Sha256::new();
        hash.update(i.tx.clone());
        let result = hash.finalize().to_vec();
        hashed_trxn.push(result);
    }

    let mut stream = RlpStream::new_list(6);

    let block_version: u32 = 678983736;
    let block_id: u32 = 350000;
    let block_size: u32 = 2783980;
    let timestamp: u32 = 178393938;
    let bits: u32 = 783883893;
    let nonce: u32 = 23838373;
    let merkle_root = get_merkle_root(hashed_trxn.clone()); 


    stream.append(&block_version);             
    stream.append(&block_id);              
    stream.append(&block_size);          
    stream.append(&timestamp);              
    stream.append(&bits);              
    stream.append(&nonce);      
    stream.append(&merkle_root);     

    let rlp_bytes = stream.out();
    H256::from(keccak256(&rlp_bytes))
}

fn main() {
    let block_hash = ethereum_block_hash();
    
    println!("");
    // println!("Block hash: 0x{:x}", block_hash);

  println!("Block hash: {}", format!("0x{:x}", block_hash).green().bold());

}


fn get_merkle_root(mut hashes: Vec<Vec<u8>>) -> Vec<u8> {

    println!("");
    println!("Getting Merkle Root");
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