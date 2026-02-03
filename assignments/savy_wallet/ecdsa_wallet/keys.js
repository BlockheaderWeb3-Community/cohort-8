import { SigningKey } from "ethers";
import { ethers, Mnemonic, randomBytes } from "ethers";

// Generate random mnemonic phrase

const generateMnemonic = Mnemonic.fromEntropy(randomBytes(16));
console.log("\n---- Mnemonic Phrase ----");
console.log("Generated Mnemonic is:", generateMnemonic.phrase);

function hashMnemonic(generateMnemonic) {
  // Hash the mnemonic phrase using sha256 to give you the seed.
  const seed = ethers.sha256(ethers.toUtf8Bytes(generateMnemonic.phrase));
  console.log("\n---- SEED ----");
  console.log("The SEED is:", seed);

  // Hash the SEED using keccak246 to give generate the private key.
  const privateKey = ethers.keccak256(ethers.toUtf8Bytes(seed));
  console.log("\n----- Private Key -----");
  console.log("The Private Keey is:", privateKey);

  //   Generate the public key from the private key using the standard elliptic cure digital signature algorithm (ECDSA).
  //   const pKey = privateKey
  const signingKey = new SigningKey(privateKey);
  const output = signingKey.publicKey;
  console.log("\n----- Output-----");
  console.log("The Public Key is:", output);
  // Using keccak256 to hash the 132 output to derive the public key
  const pukey = ethers.keccak256(output);
    const publicKey = pukey.slice(-40)
    const address = "0x" + publicKey;
    console.log("this is the address:",address);
    
}
hashMnemonic(generateMnemonic);
