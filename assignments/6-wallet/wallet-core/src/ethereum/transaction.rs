use rlp::RlpStream;
use secp256k1::ecdsa::RecoverableSignature;
use secp256k1::{Message, Secp256k1, SecretKey};
use sha3::{Digest, Keccak256};

pub fn create_signed_transaction(
    private_key: &[u8; 32],
    to: &str,
    value_wei: u128,
    nonce: u64,
    gas_price: u128,
    gas_limit: u64,
    chain_id: u64,
) -> Result<String, String> {
    let to_bytes = hex::decode(to.trim_start_matches("0x")).map_err(|_| "Invalid to address")?;

    if to_bytes.len() != 20 {
        return Err("To address must be 20 bytes".to_string());
    }

    // --- Unsigned tx (EIP-155) ---
    let mut stream = RlpStream::new_list(9);
    stream.append(&nonce);
    stream.append(&gas_price);
    stream.append(&gas_limit);
    stream.append(&to_bytes);
    stream.append(&value_wei);
    stream.append_empty_data();
    stream.append(&chain_id);
    stream.append(&0u8);
    stream.append(&0u8);

    let hash = Keccak256::digest(&stream.out());

    // --- Sign ---
    let secp = Secp256k1::new();
    let secret_key = SecretKey::from_slice(private_key).map_err(|_| "Invalid private key")?;

    let message = Message::from_digest_slice(&hash).map_err(|_| "Invalid message")?;

    let sig: RecoverableSignature = secp.sign_ecdsa_recoverable(&message, &secret_key);

    let (recovery_id, sig_bytes) = sig.serialize_compact();

    let v = recovery_id.to_i32() as u64 + chain_id * 2 + 35;
    let r = sig_bytes[0..32].to_vec();
    let s = sig_bytes[32..64].to_vec();

    // --- Signed tx ---
    let mut signed = RlpStream::new_list(9);
    signed.append(&nonce);
    signed.append(&gas_price);
    signed.append(&gas_limit);
    signed.append(&to_bytes);
    signed.append(&value_wei);
    signed.append_empty_data();
    signed.append(&v);
    signed.append(&r);
    signed.append(&s);

    Ok(format!("0x{}", hex::encode(signed.out())))
}
