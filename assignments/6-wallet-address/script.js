const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const tinysecp = require("tiny-secp256k1");
const bip32 = BIP32Factory(tinysecp);
const secp256k1 = require("secp256k1");
const { keccak256 } = require("ethereumjs-util");
const crypto = require("crypto");

const entropy = crypto.randomBytes(32);


const mnemonic = bip39.entropyToMnemonic(entropy);
console.log("Mnemonic Phrase:\n", mnemonic);

const seed = bip39.mnemonicToSeedSync(mnemonic);

const root = bip32.fromSeed(seed);

const path = "m/44'/60'/0'/0/0";
const child = root.derivePath(path);const ADDRESS_COUNT = 4;

for (let i = 0; i < ADDRESS_COUNT; i++) {
  const path = `m/44'/60'/0'/0/${i}`;
  const child = root.derivePath(path);

  const privateKey = child.privateKey;
  // console.log("\nPrivate Key:\n", Buffer.from(privateKey).toString("hex"));

  const publicKeyArray = secp256k1.publicKeyCreate(privateKey, false).slice(1);
  const publicKey = Buffer.from(publicKeyArray);
  // console.log("\nPublic Key (64 bytes):\n", publicKey.toString("hex"));

  const hash = keccak256(publicKey);

  const address = "0x" + hash.slice(-20).toString("hex");
  // console.log("\nEthereum Address:\n", address);
  console.log(`\nAddress #${i}`);
  console.log("\nPrivate Key:\n", Buffer.from(privateKey).toString("hex"));
  console.log("\nPublic Key (64 bytes):\n", publicKey.toString("hex"));
  console.log("\nEthereum Address:\n", address);
}