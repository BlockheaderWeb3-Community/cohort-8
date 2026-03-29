const crypto = require('crypto');
const Web3 = require('web3');

const SHA256 = 'sha256';
const KECCAK256 = 'keccak256';

class EtheremMerkleRoot {
  constructor(algorithm = SHA256) {
    this.algorithm = algorithm;
    this.tree = [];
    this.transactions = [];
  }

  createTransaction(n) {
    const createdTx = Array(n)
      .fill()
      .map(
        (_, index) =>
          `${this.algorithm === SHA256 ? '0x' : ''}${this.hash(
            index.toString()
          )}`
      );
    this.transactions = createdTx;
    return createdTx;
  }

  hash(data) {
    if (this.algorithm === SHA256) {
      return crypto.createHash(SHA256).update(data).digest('hex');
    } else if (this.algorithm === KECCAK256) {
      return Web3.utils.keccak256(data);
    }
  }

  buildTree() {
    // Initialize leaf level with transaction hashes
    let currentLevel = this.transactions.map((tx) => this.hash(tx));
    this.tree.push([...currentLevel]);

    // Build up the tree
    while (currentLevel.length > 1) {
      const nextLevel = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || currentLevel[i]; // Hash duplication for odd count
        const parent = this.hash(left + right);
        console.log(
          `\nParent Hash (h${i}+h${
            i + 1 || i
          }): ${parent} from h${i}: ${left} and h${i + 1 || i}: ${right}`
        );
        nextLevel.push(parent);
      }

      currentLevel = nextLevel;
      this.tree.push([...currentLevel]);
    }
  }

  getRoot() {
    return this.tree[this.tree.length - 1][0];
  }
}

// Usage
const shaMerkleTree = new EtheremMerkleRoot(SHA256);

const keccakMerkleTree = new EtheremMerkleRoot(KECCAK256);

function buildMerkleRoots(n, algorithm) {
  const merkleTree = algorithm === KECCAK256 ? keccakMerkleTree : shaMerkleTree;
  console.log(
    `\nBuilding ${
      algorithm === KECCAK256 ? 'KECCAK 256' : 'SHA 256'
    } Merkle Tree with ${n} transactions:`
  );
  const transactions = merkleTree.createTransaction(n);
  console.log('\nList of transactions: ', transactions);
  merkleTree.buildTree();
  const merkleRoot = merkleTree.getRoot();
  console.log(
    '\n================================================================='
  );
  console.log('Merkle root: ', merkleRoot);
}

// How to run:
buildMerkleRoots(7, SHA256); // For SHA 256
buildMerkleRoots(7, KECCAK256); // For KECCAK 256
