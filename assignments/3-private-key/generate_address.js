import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as ecc from 'tiny-secp256k1';
import crypto from 'crypto';
import keccak256 from 'js-sha3';

function generateEntropy(entropyBits = 128) {
  // entropyBits can be 128, 160, 192, 224, or 256
  const entropyBytes = entropyBits / 8;
  const entropy = crypto.randomBytes(entropyBytes).toString('hex');
  console.log('\n=== STEP 1: Generate Entropy ===');
  console.log(`Entropy (${entropyBits} bits):\n${entropy}`);
  return entropy;
}

function generateMnemonic(entropy) {
  console.log('\n=== STEP 2: BIP 39 - Generate Mnemonic ===');

  // Convert entropy to mnemonic (wordlist is used internally)
  const mnemonic = bip39.entropyToMnemonic(entropy);
  console.log(`Mnemonic (${mnemonic.split(' ').length} words):\n${mnemonic}`);

  // Verify the mnemonic is valid
  const isValid = bip39.validateMnemonic(mnemonic);
  console.log(`Mnemonic valid: ${isValid}`);

  return mnemonic;
}

function generateSeed(mnemonic, passphrase = '') {
  console.log('\n=== STEP 3: BIP 39 - Generate Seed ===');

  // mnemonicToSeed uses PBKDF2 with SHA-512
  // Parameters: PBKDF2(password="mnemonic" + passphrase, salt="mnemonic" + passphrase, iterations=2048, hash=SHA512)
  const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
  console.log(`Seed (512 bits / 64 bytes):\n${seed.toString('hex')}`);
  console.log(`Passphrase used: "${passphrase || '(empty)'}"`);

  return seed;
}

function createMasterKey(seed) {
  console.log('\n=== STEP 4: BIP 32 - Create Master Key ===');

  // Create master BIP32 node (for Bitcoin/Ethereum, uses "Bitcoin seed" as HMAC key)
  const masterNode = bip32.BIP32Factory(ecc).fromSeed(seed);

  console.log(`Master Private Key:\n${masterNode.privateKey.toString('hex')}`);
  console.log(`Master Public Key:\n${masterNode.publicKey.toString('hex')}`);
  console.log(`Master Chain Code:\n${masterNode.chainCode.toString('hex')}`);
  console.log(`Master Extended Private Key (xprv):\n${masterNode.toBase58()}`);

  return masterNode;
}

/**
 * Where:
 * - purpose' = 44' (BIP 44)
 * - coin_type' = 0' (Bitcoin), 1' (Bitcoin Testnet), 60' (Ethereum), etc.
 * - account' = 0' (first account)
 * - change = 0 (receiving addresses), 1 (change addresses)
 * - address_index = 0, 1, 2, ... (individual address index)
 */
function deriveBIP44Path(
  masterNode,
  coinType = 0,
  account = 0,
  change = 0,
  addressIndex = 0
) {
  console.log('\n=== STEP 5: BIP 44 - Derive Keys ===');

  // BIP 44 path: m/44'/coin_type'/account'/change/address_index
  const purpose = 44; // BIP 44

  // Common coin types:
  // 0' = Bitcoin, 1' = Bitcoin Testnet, 60' = Ethereum, 111' = Testnet (for various)

  console.log(
    `\nBIP 44 Derivation Path: m/44'/${coinType}'/0'/0/${addressIndex}`
  );
  console.log(`- purpose: ${purpose}' (BIP 44)`);
  console.log(`- coin_type: ${coinType}' (0=Bitcoin, 60=Ethereum)`);
  console.log(`- account: ${account}'`);
  console.log(`- change: ${change} (0=receiving, 1=change)`);
  console.log(`- address_index: ${addressIndex}`);

  let node = masterNode
    .deriveHardened(purpose) // m/44'
    .deriveHardened(coinType) // m/44'/coin_type'
    .deriveHardened(account) // m/44'/coin_type'/account'
    .derive(change) // m/44'/coin_type'/account'/change
    .derive(addressIndex); // m/44'/coin_type'/account'/change/address_index

  console.log(`\nDerived Private Key:\n${node.privateKey.toString('hex')}`);
  console.log(`Derived Public Key:\n${node.publicKey.toString('hex')}`);

  return node;
}

function generateAddress(publicKey, coinType = 0) {
  console.log('\n=== STEP 6: Generate Address ===');

  if (coinType === 0) {
    // Bitcoin address (P2PKH Legacy format)
    return generateBitcoinAddress(publicKey);
  } else if (coinType === 60) {
    // Ethereum address
    return generateEthereumAddress(publicKey);
  }
}

function generateBitcoinAddress(publicKey) {
  const sha256 = crypto.createHash('sha256').update(publicKey).digest();

  // For RIPEMD-160, we need crypto.createHash('ripemd160')
  const ripemd160 = crypto.createHash('ripemd160').update(sha256).digest();

  // Add version byte for Bitcoin mainnet
  const withVersion = Buffer.concat([Buffer.from([0x00]), ripemd160]);

  // Calculate checksum (first 4 bytes of double SHA256)
  const checksum = crypto
    .createHash('sha256')
    .update(crypto.createHash('sha256').update(withVersion).digest())
    .digest()
    .slice(0, 4);

  // Combine and encode in Base58
  const address = base58Encode(Buffer.concat([withVersion, checksum]));

  console.log(`Bitcoin Address (P2PKH):\n${address}`);
  return address;
}

function generateEthereumAddress(publicKey) {
  const publicKeyHex = publicKey.toString('hex');
  const keccak256Hash = keccak256.keccak256;
  const hash = keccak256Hash.update(Buffer.from(publicKeyHex, 'hex')).digest();

  // Take last 20 bytes and format as address
  const address = '0x' + Buffer.from(hash).slice(-20).toString('hex');

  console.log(`Ethereum Address:\n${address}`);
  return address;
}

function base58Encode(buffer) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  let num = 0n;
  for (const byte of buffer) {
    num = num * 256n + BigInt(byte);
  }

  let encoded = '';
  while (num > 0n) {
    encoded = ALPHABET[Number(num % 58n)] + encoded;
    num = num / 58n;
  }

  // Handle leading zeros
  for (const byte of buffer) {
    if (byte === 0) encoded = '1' + encoded;
    else break;
  }

  return encoded || '1';
}

function deriveAddressFromEntropy(entropy = null, coinType = 0) {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  BIP 39, 32, 44 - Address Derivation Workflow          ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    const finalEntropy = entropy || generateEntropy(128);

    const mnemonic = generateMnemonic(finalEntropy);

    const seed = generateSeed(mnemonic, '');

    const masterNode = createMasterKey(seed);

    const derivedNode = deriveBIP44Path(masterNode, coinType, 0, 0, 0);

    const address = generateAddress(derivedNode.publicKey, coinType);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  Summary                                               ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`Entropy:     ${finalEntropy}`);
    console.log(`Mnemonic:    ${mnemonic}`);
    console.log(`Address:     ${address}`);

    return {
      entropy: finalEntropy,
      mnemonic: mnemonic,
      seed: seed.toString('hex'),
      masterNode: masterNode,
      derivedNode: derivedNode,
      address: address,
    };
  } catch (error) {
    console.error('Error during derivation:', error.message);
    throw error;
  }
}

deriveAddressFromEntropy(null, 60);
