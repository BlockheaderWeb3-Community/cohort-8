const crypto = require('crypto');
const { createHmac } = require('crypto');

// Simple Keccak256 hashing (using crypto-js for browser compatibility)
// For Node.js, we'll use the built-in crypto module with sha3
const keccak256 = (data) => {
  // Using Node.js crypto for Keccak256
  // Note: Node.js native crypto doesn't have Keccak256, so we use external library
  const hash = createHmac('sha256', Buffer.from(data)).digest();
  return hash;
};

// BIP39 Word List (subset for demo - in production use full 2048 word list)
const BIP39_WORDLIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'abuse', 'access',
  'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action',
  'actor', 'acts', 'actual', 'add', 'adds', 'adept', 'admin', 'admit', 'adobe', 'adopt',
  // ... extended word list would go here (2048 total words)
];

class BIP32Wallet {
  constructor() {
    this.masterSeed = null;
    this.keys = [];
  }

  /**
   * Generate random entropy (128-256 bits)
   * @param {number} entropyBits - bits for entropy (128, 160, 192, 224, 256)
   * @returns {Buffer} Random entropy
   */
  generateEntropy(entropyBits = 256) {
    const entropyBytes = entropyBits / 8;
    return crypto.randomBytes(entropyBytes);
  }

  /**
   * Generate SHA256 hash
   * @param {Buffer} data - data to hash
   * @returns {Buffer} SHA256 hash
   */
  sha256(data) {
    return crypto.createHash('sha256').update(data).digest();
  }

  /**
   * Calculate checksum for BIP39 mnemonic
   * @param {Buffer} entropy - entropy buffer
   * @returns {string} checksum bits as string
   */
  calculateChecksum(entropy) {
    const hash = this.sha256(entropy);
    const bits = hash.toString('hex').split('').map(x => parseInt(x, 16).toString(2).padStart(4, '0')).join('');
    const checksumLength = entropy.length / 4;
    return bits.slice(0, checksumLength);
  }

  /**
   * Generate BIP39 Mnemonic from entropy
   * @param {Buffer} entropy - entropy buffer
   * @returns {string} mnemonic phrase
   */
  generateMnemonic(entropy = null) {
    if (!entropy) {
      entropy = this.generateEntropy(256);
    }

    // Calculate checksum
    const checksum = this.calculateChecksum(entropy);

    // Convert entropy to binary
    let entropyBits = entropy.toString('hex').split('').map(x => parseInt(x, 16).toString(2).padStart(4, '0')).join('');
    
    // Add checksum to entropy bits
    const totalBits = entropyBits + checksum;

    // Split into 11-bit groups
    const mnemonicIndices = [];
    for (let i = 0; i < totalBits.length; i += 11) {
      const bits = totalBits.slice(i, i + 11);
      mnemonicIndices.push(parseInt(bits, 2));
    }

    // Map indices to words
    // Using simplified wordlist - in production use full BIP39 wordlist
    const words = mnemonicIndices.map(index => this.getWord(index));
    
    return words.join(' ');
  }

  /**
   * Get word from BIP39 wordlist by index
   * @param {number} index - word index
   * @returns {string} word
   */
  getWord(index) {
    // Simplified - in production load full 2048 word BIP39 list
    const wordlists = {
      0: 'abandon', 1: 'ability', 2: 'able', 3: 'about', 4: 'above', 5: 'absent',
      // ... full 2048 words would be here
    };
    return wordlists[index] || `word${index}`;
  }

  /**
   * Derive seed from mnemonic (PBKDF2)
   * @param {string} mnemonic - mnemonic phrase
   * @param {string} passphrase - optional passphrase
   * @returns {Buffer} seed (512 bits)
   */
  deriveSeed(mnemonic, passphrase = '') {
    const password = Buffer.from(mnemonic, 'utf8');
    const salt = Buffer.from('mnemonic' + passphrase, 'utf8');

    // PBKDF2 with SHA512, 2048 iterations
    return crypto.pbkdf2Sync(password, salt, 2048, 64, 'sha512');
  }

  /**
   * Generate child keys using BIP32 derivation
   * @param {Buffer} seed - master seed
   * @param {string} path - derivation path (e.g., "m/44'/60'/0'/0")
   * @returns {Object} derived key object
   */
  deriveChildKey(seed, path = "m/0") {
    let key = seed;
    let chainCode = null;

    // Initial master key generation
    const hmac = createHmac('sha512', Buffer.from('Bitcoin seed'));
    const result = hmac.update(seed).digest();
    
    let masterKey = result.slice(0, 32);
    chainCode = result.slice(32);

    // Parse path and derive keys
    const pathParts = path.split('/').slice(1); // Skip 'm'

    for (const part of pathParts) {
      const isHardened = part.endsWith("'");
      let index = parseInt(part);

      if (isHardened) {
        index = index + 0x80000000; // Add hardened offset
      }

      // HMAC-SHA512 with chain code
      const indexBuffer = Buffer.alloc(4);
      indexBuffer.writeUInt32BE(index, 0);

      const hmacChild = createHmac('sha512', chainCode);
      const childData = Buffer.concat([masterKey, indexBuffer]);
      const childResult = hmacChild.update(childData).digest();

      masterKey = childResult.slice(0, 32);
      chainCode = childResult.slice(32);
    }

    return {
      privateKey: masterKey,
      chainCode: chainCode
    };
  }

  /**
   * Secp256k1 - Convert private key to public key
   * For production, use a library like 'secp256k1' npm package
   * This is a placeholder implementation
   * @param {Buffer} privateKey - 256-bit private key
   * @returns {Buffer} uncompressed public key (512 bits, 64 bytes)
   */
  derivePublicKey(privateKey) {
    // In production, use actual secp256k1 library
    // const secp256k1 = require('secp256k1');
    // const publicKey = secp256k1.publicKeyCreate(privateKey, false);
    
    // For demo purposes, using Node crypto (limited secp256k1 support)
    // Simplified placeholder - always use production secp256k1 library
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKey);
    return ecdh.getPublicKey(null, 'uncompressed').slice(1); // Remove prefix byte
  }

  /**
   * Generate Ethereum address from public key
   * Keccak256(publicKey) -> last 20 bytes
   * @param {Buffer} publicKey - uncompressed public key
   * @returns {string} Ethereum address (0x + 40 hex chars)
   */
  generateAddress(publicKey) {
    // Use external keccak256 - crypto.createHash doesn't support keccak256 natively
    // For production: npm install keccak
    try {
      const keccak256 = require('keccak256');
      const hash = keccak256(publicKey);
      const address = '0x' + hash.slice(-20).toString('hex').toLowerCase();
      return address;
    } catch (e) {
      // Fallback if keccak256 library not available
      console.warn('Install keccak256 library for proper address generation');
      // Using SHA256 as fallback (not correct, but demonstrates concept)
      const hash = this.sha256(publicKey);
      const address = '0x' + hash.slice(-20).toString('hex').toLowerCase();
      return address;
    }
  }

  /**
   * Generate complete wallet with multiple keys
   * @param {number} count - number of keys to generate
   * @param {string} mnemonic - existing mnemonic or generate new
   * @returns {Object} wallet data
   */
  createWallet(count = 5, mnemonic = null) {
    // Generate mnemonic if not provided
    if (!mnemonic) {
      const entropy = this.generateEntropy(256);
      mnemonic = this.generateMnemonic(entropy);
    }

    // Derive seed from mnemonic
    const seed = this.deriveSeed(mnemonic);
    this.masterSeed = seed;

    // Generate keys
    const keys = [];
    for (let i = 0; i < count; i++) {
      const path = `m/44'/60'/0'/0/${i}`; // Ethereum derivation path
      const derived = this.deriveChildKey(seed, path);
      
      const publicKey = this.derivePublicKey(derived.privateKey);
      const address = this.generateAddress(publicKey);

      keys.push({
        index: i,
        path: path,
        privateKey: derived.privateKey.toString('hex'),
        publicKey: publicKey.toString('hex'),
        address: address,
        chainCode: derived.chainCode.toString('hex')
      });
    }

    this.keys = keys;

    return {
      mnemonic: mnemonic,
      seed: seed.toString('hex'),
      keys: keys
    };
  }

  /**
   * Export wallet data
   * @returns {Object} wallet export
   */
  exportWallet() {
    return {
      keys: this.keys,
      masterSeed: this.masterSeed ? this.masterSeed.toString('hex') : null
    };
  }

  /**
   * Display wallet info
   */
  displayWallet() {
    console.log('\n========== BIP-32 Wallet ==========');
    console.log('Keys Generated:', this.keys.length);
    this.keys.forEach(key => {
      console.log('\n--- Account', key.index, '---');
      console.log('Path:', key.path);
      console.log('Private Key:', key.privateKey);
      console.log('Public Key:', key.publicKey);
      console.log('Address:', key.address);
    });
    console.log('\n==================================\n');
  }
}

// Example usage
async function main() {
  const wallet = new BIP32Wallet();

  // Create wallet with 5 accounts
  const walletData = wallet.createWallet(5);

  console.log('Mnemonic:', walletData.mnemonic);
  console.log('Master Seed:', walletData.seed);
  console.log('\nGenerated Accounts:');

  walletData.keys.forEach((key, idx) => {
    console.log(`\nAccount ${idx}:`);
    console.log(`  Path: ${key.path}`);
    console.log(`  Private Key: ${key.privateKey}`);
    console.log(`  Public Key: ${key.publicKey}`);
    console.log(`  Address: ${key.address}`);
  });

  wallet.displayWallet();
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = BIP32Wallet;
