import fs from 'node:fs';
import { randomBytes, createHash } from 'node:crypto';
import { keccak256, SigningKey } from 'ethers';

// Read dictionary
const rawDictionaryData = fs.readFileSync('./dictionary.json', 'utf-8');
const wordDictionary: Record<string, string> = JSON.parse(rawDictionaryData);

// Convert dictionary values to array
const wordList: string[] = Object.values(wordDictionary);

// wordCount
const dictionaryLength: number = wordList.length;

const mnemonicCount: number = 12;

function generateRandomNumbers(count: number): number[] {
  console.log('Random bytes are: ', count);
  return Array.from(randomBytes(count));
}

function numberToWord(n: number): string {
  const index = n % dictionaryLength;
  return wordList[index];
}

// 1. Generate secure numbers
const numberArray: number[] = generateRandomNumbers(mnemonicCount);

// 2. Convert numbers to words
const wordArray: string[] = numberArray.map(numberToWord);

// 3. Concatenate into final mnemonic phrase
function generateCodeWords(): string {
  return wordArray.join(' ');
}

console.log(' ');
const mnemonicPhrase = generateCodeWords();
console.log(`My mnemonic phrase is: ${mnemonicPhrase}`);

console.log(' ');

// SHA256 and Keccak256 hashing functions
function sha256Hash(input: string): string {
  const hash = createHash('sha256').update(input, 'utf8').digest('hex');

  console.log('SHA-256 seed:', hash);
  console.log('Seed length (hex):', hash.length); // 64
  return hash;
}

// function keccak256Hash(hexInput: string): string {
//   const bytes = arrayify('0x' + hexInput.replace(/^0x/, ''));
//   const hash = keccak256(bytes);

//   console.log('Keccak-256 hash:', hash);
//   console.log('Hash length:', hash.length); // 66 (0x + 64)
//   return hash;
// }

function keccak256Hash(hexInput: string): string {
  // Ensure 0x-prefixed hex so ethers treats it as BYTES
  const normalized = hexInput.startsWith('0x') ? hexInput : '0x' + hexInput;

  const hash = keccak256(normalized);

  console.log('Keccak-256 hash:', hash);
  console.log('Hash length:', hash.length); // 66
  return hash;
}

// 4. Seed: Hash the concatenated words (mnemonic phrase)
const seed = sha256Hash(mnemonicPhrase);
console.log(' ');

// 5. Private Key: Hashing the seed using Keccak-256 algorithm
const privateKey = keccak256Hash(seed);
console.log(' ');

// 6. Generate public key from private key (secp256k1) 
// in `ethers`, `SigningKey` is a thin wrapper around *secp256k1* elliptic curve
const signingKey = new SigningKey(privateKey);
const publicKey = signingKey.publicKey;

console.log('Public Key:', publicKey);
console.log('Public Key length:', publicKey.length); // 132
console.log(' ');

// 7. Remove uncompressed prefix (0x04) and hash as BYTES
// const publicKeyWithoutPrefix = '0x' + publicKey.slice(4);
// const publicKeyHash = keccak256(publicKeyWithoutPrefix);
const publicKeyHash = keccak256(publicKey);
console.log('Keccak-256(Public Key) hash:', publicKeyHash);
console.log('The length of the Public Key hash:', publicKeyHash.length);
console.log(' ');

// Step 10: Take last 20 bytes (40 hex chars)
const slicedPublicKeyHash = publicKeyHash.slice(-40);
console.log("Sliced public key hash is: ", slicedPublicKeyHash);
console.log(' ');

// const address = '0x' + publicKeyHash.slice(-40);
const address = "0x" + slicedPublicKeyHash;
console.log('Ethereum Address:', address);
console.log('Address length is: ', address.length);
console.log(' ');



// 1. Start with a cryptographically secure pseudo-random number generator
// 2. Generate a set of code words from the random output
// 3. Concatenate all the code words into a single word or phrase
// 4. Hash the concatenated words using SHA to form the mnemonic seed
// 5. Treat the seed as the hash result of all previous steps combined
// 6. Hash the seed again using Keccak-256
// 7. The Keccak-256 output is the final 256-bit private key

// 8. Use *secp256k1* to hash your private key to get a public key
// 9. Use Keccak-256 to hash the public key
// 10. Slice the first 20 index of the output of the result of the keccak-256 and pre-pend 0x to its result, you get your *address*




