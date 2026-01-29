// const { ecrecover, pubToAddress } = require("ethereumjs-util");

// // Recover public key
// const messageHash = Buffer.from("your_message_hash_here", "hex");
// const signature = {
//   r: Buffer.from("your_signature_r_here", "hex"),
//   s: Buffer.from("your_signature_s_here", "hex"),
//   v: 27, // or 28
// };
// const recoveredPubKey = ecrecover(
//   messageHash,
//   signature.v,
//   signature.r,
//   signature.s
// );

// // Recover address
// const recoveredAddress =
//   "0x" + pubToAddress(recoveredPubKey).toString("hex");

// console.log("Recovered Address:", recoveredAddress);





// const bip39 = require("bip39");
// const { BIP32Factory } = require("bip32");
// const tinysecp = require("tiny-secp256k1");
// const bip32 = BIP32Factory(tinysecp);
// const secp256k1 = require("secp256k1");
// const { keccak256 } = require("ethereumjs-util");
// const crypto = require("crypto");


// const entropy = crypto.randomBytes(16);


// const mnemonic = bip39.entropyToMnemonic(entropy);
// console.log("Mnemonic Phrase:\n", mnemonic);

// const seed = bip39.mnemonicToSeedSync(mnemonic);

// const root = bip32.fromSeed(seed);

// const path = "m/44'/60'/0'/0/0";
// const child = root.derivePath(path);const ADDRESS_COUNT = 10;

// for (let i = 0; i < ADDRESS_COUNT; i++) {
//   const path = `m/44'/60'/0'/0/${i}`;
//   const child = root.derivePath(path);


// const privateKey = child.privateKey;

// const publicKeyArray = secp256k1.publicKeyCreate(privateKey, false).slice(1);
// const publicKey = Buffer.from(publicKeyArray);

// const hash = keccak256(publicKey);

// const address = "0x" + hash.slice(-20).toString("hex");

//   console.log(`\nAddress #${i}`);
//   console.log("\nPrivate Key:\n", Buffer.from(privateKey).toString("hex"));
//   console.log("\nPublic Key (64 bytes):\n", publicKey.toString("hex"));
//   console.log("\nEthereum Address:\n", address);
// }