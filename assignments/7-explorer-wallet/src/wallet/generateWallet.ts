
import { keccak256, SigningKey } from 'ethers';
import { wordList } from './dictionary';

const MNEMONIC_COUNT = 12;

function secureRandomBytes(count: number): Uint8Array {
  const bytes = new Uint8Array(count);
  crypto.getRandomValues(bytes); 
  return bytes;
}

function numberToWord(n: number): string {
  return wordList[n % wordList.length];
}

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const buf = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}


export async function generateWallet() {
  // 1. Entropy
  const entropy = secureRandomBytes(MNEMONIC_COUNT);

  // 2. Mnemonic
  const words = Array.from(entropy).map(numberToWord);
  const mnemonic = words.join(' ');

  // 3. Seed
  const seed = await sha256Hex(mnemonic);

  // 4. Private key
  const privateKey = keccak256('0x' + seed);

  // 5. Public key
  const signingKey = new SigningKey(privateKey);
  const publicKey = signingKey.publicKey;

  // 6. Address
  const address = '0x' + keccak256(publicKey).slice(-40);

  return {
    mnemonic,
    seed,
    privateKey,
    publicKey,
    address,
  };
}

