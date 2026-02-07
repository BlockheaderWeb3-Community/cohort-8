const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const secp = require("secp256k1");
const { keccak256 } = require("ethereumjs-util");
const { randomBytes } = require("crypto");

const DERIVATION_BASE = "m/44'/60'/0'/0/";
const TOTAL_WALLETS = 3;

//Generate entropy and mnemonic
const entropyBuffer = randomBytes(32);
const mnemonic = bip39.entropyToMnemonic(entropyBuffer);
console.log("Mnemonic Phrase:\n", mnemonic);

//Convert mnemonic → seed
const seedBuffer = bip39.mnemonicToSeedSync(mnemonic);

//Create master HD wallet node
const masterNode = bip32.fromSeed(seedBuffer);

// Helper function to derive Ethereum address
function getEthereumAddress(privateKey) {
  const publicKey = secp.publicKeyCreate(privateKey, false).slice(1);
  const hash = keccak256(Buffer.from(publicKey));
  return "0x" + hash.slice(-20).toString("hex");
}

//Derive multiple child wallets
for (let i = 0; i < TOTAL_WALLETS; i++) {
  const path = DERIVATION_BASE + i;
  const childNode = masterNode.derivePath(path);

  const privateKeyHex = Buffer.from(childNode.privateKey).toString("hex");
  const address = getEthereumAddress(childNode.privateKey);

  console.log(`\n===== Wallet ${i} =====`);
  console.log("Path:", path);
  console.log("Private Key:", privateKeyHex);
  console.log("Address:", address);
}
