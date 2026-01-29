


const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const secp256k1 = require("secp256k1");
const { keccak256 } = require("ethereumjs-util");
const crypto = require("crypto");

const entropyBuffer = crypto.randomBytes(16);

const words = bip39.entropyToMnemonic(entropyBuffer);
console.log("Mnemonic:\n", words);

const seedBuffer = bip39.mnemonicToSeedSync(words);

const Trunk = bip32.fromSeed(seedBuffer);

const TOTAL_ADDRESSES = 5;

for (let index = 0; index < TOTAL_ADDRESSES; index++) {
  const derivationPath = `m/44'/60'/0'/0/${index}`;
  const branch = Trunk.derivePath(derivationPath);

  const privKey = Buffer.from(branch.privateKey);
  const fullPublicKey = secp256k1.publicKeyCreate(privKey, false);
  // console.log ("publicKey: ", fullPublicKey.length)
  const ethPublicKey = Buffer.from(fullPublicKey.slice(1));
  const hashOutput = keccak256(ethPublicKey);

  const ethAddress = "0x" + hashOutput.slice(-20).toString("hex");

  console.log(`\nWallet ${index + 1}`);
  console.log("Derivation Path:", derivationPath);
  console.log("Private Key:", privKey.toString("hex"));
  console.log("Public Key:", ethPublicKey.toString("hex"));
  console.log("Output:", hashOutput.toString("hex"));
  console.log("Wallet Address:", ethAddress);
};

