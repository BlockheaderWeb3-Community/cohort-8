import os
from bip_utils import (
    Bip39MnemonicGenerator,
    Bip39SeedGenerator,
    Bip44,
    Bip44Coins,
    Bip44Changes
)
from eth_utils import keccak
from ecdsa import SigningKey, SECP256k1

ADDRESS_COUNT = 10;

# 1️⃣ Generate entropy (32 bytes)
entropy = os.urandom(32)

# 2️⃣ Generate mnemonic
mnemonic = Bip39MnemonicGenerator().FromEntropy(entropy)
print("Mnemonic Phrase:\n", mnemonic)

# 3️⃣ Generate seed from mnemonic
seed = Bip39SeedGenerator(mnemonic).Generate()

# 4️⃣ Create BIP44 Ethereum root
bip44_ctx = Bip44.FromSeed(seed, Bip44Coins.ETHEREUM)

# 5️⃣ Generate addresses
for i in range(ADDRESS_COUNT):
    acct = (
        bip44_ctx
        .Purpose()
        .Coin()
        .Account(0)
        .Change(Bip44Changes.CHAIN_EXT)
        .AddressIndex(i)
    )

    private_key_bytes = acct.PrivateKey().Raw().ToBytes()
    private_key_hex = private_key_bytes.hex()

    # 6️⃣ Derive public key (uncompressed, 64 bytes)
    sk = SigningKey.from_string(private_key_bytes, curve=SECP256k1)
    vk = sk.verifying_key
    public_key_bytes = vk.to_string()  # 64 bytes

    # 7️⃣ Ethereum address
    address = "0x" + keccak(public_key_bytes)[-20:].hex()

    print(f"\nAddress #{i}")
    print("Private Key:\n", private_key_hex)
    print("Public Key (64 bytes):\n", public_key_bytes.hex())
    print("Ethereum Address:\n", address)
