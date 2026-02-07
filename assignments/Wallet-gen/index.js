const ethers = require('ethers');

// 1. Generate new wallet
const wallet = ethers.Wallet.createRandom();
console.log('Address:', wallet.address);
console.log('Mnemonic:', wallet.mnemonic.phrase);
console.log('Private Key:', wallet.privateKey)
console.log('Public Key:', wallet.signingKey.publicKey);
// 2. To restore: ethers.Wallet.fromPhrase('your mnemonic here');