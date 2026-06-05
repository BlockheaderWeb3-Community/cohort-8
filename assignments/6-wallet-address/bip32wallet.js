// const bip39 = require('bip39');
// const { Wallet, HDNodeWallet } = require('ethers');

import bip39 from 'bip39';
import { HDNodeWallet } from "ethers";

const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0";

const deriveWallet = (
  mnemonic,
  path = ETH_DERIVATION_PATH
) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);

  return {
    path,
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey
  };
};

const generateMnemonic = (strength = 128) =>
  bip39.generateMnemonic(strength);

const deriveMultiple = (
  mnemonic,
  count = 5,
  basePath = "m/44'/60'/0'/0"
) =>
  Array.from({ length: count }, (_, i) =>
    deriveWallet(mnemonic, `${basePath}/${i}`)
  );

/* Example */
const mnemonic = generateMnemonic();
console.log(deriveWallet(mnemonic));
console.log(deriveMultiple(mnemonic, 3));
