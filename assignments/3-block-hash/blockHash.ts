import * as fs from 'node:fs';
import { ethers } from 'ethers';

// Keccak256 helper
function keccak256Hash(first: Buffer, second: Buffer): string {
  const combinedLeaf = Buffer.concat([first, second]);
  return ethers.keccak256(combinedLeaf);
}

// Merkle Root builder
function buildMerkleRoot(
  leaves: string[],
  hashFunc: (first: Buffer, second: Buffer) => string
): string {
  if (leaves.length === 0) {
    throw new Error('No leaves provided');
  }

  let level: Buffer[] = leaves.map((leaf) => Buffer.from(leaf.slice(2), 'hex'));

  while (level.length > 1) {
    const nextLevel: Buffer[] = [];

    for (let i = 0; i < level.length; i += 2) {
      const first = level[i];
      const second = i + 1 < level.length ? level[i + 1] : first;
      const parentHex = hashFunc(first, second);
      nextLevel.push(Buffer.from(parentHex.slice(2), 'hex'));
    }

    console.log(
      'Current level hashes:',
      nextLevel.map((hash) => hash.toString('hex'))
    );

    level = nextLevel;
  }

  return '0x' + level[0].toString('hex');
}

// Read block.json
const data = fs.readFileSync('block.json', 'utf8');
const blockData = JSON.parse(data);

// Extract fields (unchanged names)
const {
  version,
  height,
  size,
  previousBlockHash,
  stateRoot,
  receiptsRoot,
  logsBloom,
  difficulty,
  gasLimit,
  gasUsed,
  baseFeePerGas,
  timestamp,
  extraData,
  mixHash,
  nonce,
  transactionHashes,
} = blockData;

// Compute transactionsRoot
const transactionsRoot = buildMerkleRoot(transactionHashes, keccak256Hash);

// Log block info
console.log('Block Version:', version);
console.log('Block Height:', height);
console.log('Block Size:', size);
console.log('Parent Hash:', previousBlockHash);
console.log('Transactions Root:', transactionsRoot);
console.log('Timestamp:', timestamp);
console.log('Nonce:', nonce);
console.log('');

// Serialize Ethereum block header
const headerBuf = Buffer.concat([
  Buffer.from(previousBlockHash.slice(2), 'hex'),
  Buffer.from(stateRoot.slice(2), 'hex'),
  Buffer.from(transactionsRoot.slice(2), 'hex'),
  Buffer.from(receiptsRoot.slice(2), 'hex'),
  Buffer.from(logsBloom.slice(2), 'hex'),
  Buffer.from(difficulty.slice(2), 'hex'),

  // gas fields
  Buffer.alloc(8, 0),
  Buffer.alloc(8, 0),
  Buffer.alloc(8, 0),
]);

headerBuf.writeBigUInt64BE(BigInt(gasLimit), headerBuf.length - 24);
headerBuf.writeBigUInt64BE(BigInt(gasUsed), headerBuf.length - 16);
headerBuf.writeBigUInt64BE(BigInt(baseFeePerGas), headerBuf.length - 8);

// Final header assembly
const timeBuf = Buffer.alloc(8);
timeBuf.writeBigUInt64BE(BigInt(timestamp), 0);

const finalHeader = Buffer.concat([
  headerBuf,
  timeBuf,
  Buffer.from(extraData.slice(2), 'hex'),
  Buffer.from(mixHash.slice(2), 'hex'),
  Buffer.from(nonce.slice(2).padStart(16, '0'), 'hex'),
]);

// Ethereum Block Hash (Keccak256)
const blockHash = ethers.keccak256(finalHeader);

console.log('Ethereum Block Hash:', blockHash);
