import crypto from 'crypto';
import bip39 from 'bip39';
import * as bip32 from 'bip32';
import { getPublicKey } from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3.js';

async function main() {
  const entropy = crypto.randomBytes(32);
  // console.log(entropy);
  const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));

  const seed = await bip39.mnemonicToSeed(mnemonic);

  const root = bip32.fromSeed(seed);
  const derivationPath = "m/44'/60'/0'/0/0";
  const child = root.derivePath(derivationPath);
  const privateKey = child.privateKey;
  if (!privateKey) throw new Error('Derived node has no private key');

  const pubKey = getPublicKey(privateKey, false);
  const pubKeyNoPrefix = pubKey.slice(1);

  const hash = keccak_256(pubKeyNoPrefix);

  // const address = "0x" + toHex(hash.slice(-20));
  const address = '0x' + Buffer.from(hash).toString('hex');

  console.log({
    entropy: entropy.toString('hex'),
    mnemonic,
    seed: seed.toString('hex'),
    derivationPath,
    privateKey: privateKey.toString('hex'),
    publicKey: Buffer.from(pubKey).toString('hex'),
    address,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
