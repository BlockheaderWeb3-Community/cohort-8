import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { HDKey } from '@scure/bip32';
import * as secp from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { Wallet } from 'ethers';

const phrase = bip39.generateMnemonic(wordlist, 128);
console.log(`Mnemonic Phrase: ${phrase}`);

const seed = await bip39.mnemonicToSeed(phrase);
console.log(`Seed: ${seed}`);

const mPKey = HDKey.fromMasterSeed(seed);
// console.log(`Master Private Key: ${mPKey.toString("hex")}`);
console.log(
  'Master Private Key:',
  Buffer.from(mPKey.privateKey).toString('hex')
);

const child = mPKey.derive("m/44'/60'/0'/0/0");
const cPKey = child.privateKey;
// console.log(`Private Key: ${cPKey}`);
console.log('Private Key:', Buffer.from(cPKey).toString('hex'));

const pubKey = secp.getPublicKey(cPKey, false).slice(1);
console.log('Public Key:', Buffer.from(pubKey).toString('hex'));

const address =
  '0x' + Buffer.from(keccak_256(pubKey).slice(-20)).toString('hex');
console.log(`Ethereum Address: ${address}`);

// console.log(Wallet.fromPhrase(phrase).address);

if (address == Wallet.fromPhrase(phrase).address.toLowerCase()) {
  console.log(`Ethereum Address Successfully created!`);
}
