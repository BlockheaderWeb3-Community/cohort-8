const { ethers } = require("ethers");
const bip39 = require("bip39");

async function generateWallet() {
    console.log("--- ETHEREUM WALLET GENERATOR (BIP-39 / BIP-32) ---");

    // 1. Generate a random Mnemonic (BIP-39)
    const mnemonic = bip39.generateMnemonic();
    console.log(`\n1. MNEMONIC PHRASE:\n   ${mnemonic}`);

    // 2. Convert Mnemonic to Seed (BIP-39)
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    console.log(`\n2. BINARY SEED (Hex):\n   0x${seed.toString('hex').substring(0, 64)}...`);

    // 3. Create HD Wallet & Derive Path (BIP-32 & BIP-44)
    // Standard Ethereum Path: m / 44' / 60' / 0' / 0 / 0
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

    console.log(`\n3. WALLET DETAILS:`);
    console.log(`   Path: ${hdNode.path}`);
    console.log(`   Address: ${hdNode.address}`);
    console.log(`   Private Key: ${hdNode.privateKey}`);
}

generateWallet();