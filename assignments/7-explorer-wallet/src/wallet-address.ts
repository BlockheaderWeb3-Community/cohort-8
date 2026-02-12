import fs from 'node:fs';
import { randomBytes, createHash } from 'node:crypto';
import { keccak256, SigningKey } from 'ethers';

// Read dictionary
const rawDictionaryData = fs.readFileSync('./dictionary.json', 'utf-8');
const wordDictionary: Record<string, string> = JSON.parse(rawDictionaryData);

// Convert dictionary values to array
const wordList: string[] = Object.values(wordDictionary);
const dictionaryLength: number = wordList.length;

const mnemonicCount: number = 12;

function generateRandomNumbers(count: number): number[] {
  return Array.from(randomBytes(count));
}

function numberToWord(n: number): string {
  const index = n % dictionaryLength;
  return wordList[index];
}

function sha256Hash(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function keccak256Hash(hexInput: string): string {
  const normalized = hexInput.startsWith('0x') ? hexInput : '0x' + hexInput;
  return keccak256(normalized);
}

/**
 * 🚀 MAIN EXPORTED FUNCTION
 */
export function generateWallet() {
  // 1. Generate secure numbers
  const numberArray: number[] = generateRandomNumbers(mnemonicCount);

  // 2. Convert numbers to words
  const wordArray: string[] = numberArray.map(numberToWord);

  // 3. Concatenate mnemonic
  const mnemonicPhrase = wordArray.join(' ');

  // 4. Seed (SHA-256)
  const seed = sha256Hash(mnemonicPhrase);

  // 5. Private Key (Keccak-256)
  const privateKey = keccak256Hash(seed);

  // 6. Public Key (secp256k1)
  const signingKey = new SigningKey(privateKey);
  const publicKey = signingKey.publicKey;

  // 7. Hash public key
  const publicKeyHash = keccak256(publicKey);

  // 8. Slice last 20 bytes → address
  const address = '0x' + publicKeyHash.slice(-40);

  // ✅ EXPORT EVERYTHING
  return {
    mnemonic: mnemonicPhrase,
    seed,
    privateKey,
    publicKey,
    address,
  };
}
