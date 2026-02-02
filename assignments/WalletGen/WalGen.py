import os
from bip_utils import (
    Bip39EntropyGenerator, Bip39MnemonicGenerator, 
    Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes
)
import codecs
from eth_utils import keccak
from eth_keys import keys

#  ENTROPY 
# 16 bytes = 128 bits (results in a 12-word mnemonic)
entropy_bytes = os.urandom(16)
print(f"1. Entropy (Hex): {entropy_bytes.hex()}")

#  MNEMONIC 
mnemonic = Bip39MnemonicGenerator().FromEntropy(entropy_bytes)
print(f"2. Mnemonic: {mnemonic}")

#  SEED 
# PBKDF2 with 2048 iterations happens here
seed_bytes = Bip39SeedGenerator(mnemonic).Generate()
print(f"3. Seed (Hex): {seed_bytes.hex()[:64]}...") # Showing first 64 chars

# PRIVATE KEY 
# We use the BIP-44 standard for Ethereum
bip44_mst_ctx = Bip44.FromSeed(seed_bytes, Bip44Coins.ETHEREUM)

# Path: m/44'/60'/0'/0/0 = BIP-44 for Ethereum
bip44_addr_ctx = (
bip44_mst_ctx.Purpose()
.Coin()
.Account(0)
.Change(Bip44Changes.CHAIN_EXT)
.AddressIndex(0)
)

# Final Private Key
priv_key = bip44_addr_ctx.PrivateKey().Raw().ToHex()
print(f"4. Private Key: 0x{priv_key}")


#  We derived the 256-bit Private Key ---
# (Using the BIP-32/44 process discussed previously)
priv_key_hex = priv_key

def derive_eth_address(private_key_hex):
    # Clean the hex string and convert to bytes
    priv_bytes = bytes.fromhex(private_key_hex.replace("0x", ""))
    
    # Get the Private Key object
    priv_key_obj = keys.PrivateKey(priv_bytes)
    
    # Get the Public Key using secp256k1
    pub_key_obj = priv_key_obj.public_key
    pub_key_bytes = pub_key_obj.to_bytes() 
    
    # Hash the public key using Keccak-256
    public_key_hash = keccak(pub_key_bytes)
    
    # Slice the LAST 20 bytes and prepend 0x
    address_bytes = public_key_hash[-20:]
    address = "0x" + address_bytes.hex()
    
    return address

# Execute
eth_address = derive_eth_address(priv_key_hex)

# print(f"Private Key: {priv_key_hex}")
print(f"Eth Address: {eth_address}")