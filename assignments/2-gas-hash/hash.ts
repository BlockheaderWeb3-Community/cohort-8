
import { ethers } from "ethers";
import * as crypto from 'crypto';
import * as readline from 'readline-sync';

// Gas Price Calculation
function calculateGasFee() {
  // Prompt for gas price (in Gwei)
  const gasPriceGwei = parseFloat(
    readline.question("Enter gas price in Gwei: "),
  );

  // Prompt for gas used (in units)
  const gasUsed = parseFloat(readline.question("Enter gas used: "));

  // Calculate total gas fee in ETH
  const totalGasFee = (gasPriceGwei * gasUsed) / 1e9; // Convert Gwei to ETH
  console.log(`Total Gas Fee: ${totalGasFee} ETH`);
}

// Merkle Root Calculations

// Helper function to hash using the SHA256 algorithm
function sha256Hash(first: Buffer, second: Buffer): string {
  const combinedLeaf = Buffer.concat([first, second]);
  return crypto.createHash("sha256").update(combinedLeaf).digest("hex");

}

// Similarly, KACCAK256 helper function to combine two leafs
function keccak256Hash(first: Buffer, second: Buffer): string {
  const combinedLeaf = Buffer.concat([first, second]);
  return ethers.keccak256(combinedLeaf);
}

// Function to build Merkle Root
function buildMerkleRoot(leaves: string[], hashFunc: (first: Buffer, second: Buffer) => string,): string {
  // Check for leaves
  if (leaves.length === 0) {
    throw new Error("No leaves provided");
  }

  // Convert hex leaves to Buffers: So we dont have to use the 0x prefix
  let level: Buffer[] = leaves.map((leaf) => Buffer.from(leaf.slice(2), "hex"));

  while (level.length > 1) {
    const nextLevel: Buffer[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const first = level[i];
      const second = i + 1 < level.length ? level[i + 1] : first;
      const parentHex = hashFunc(first, second);
      nextLevel.push(Buffer.from(parentHex.slice(2), "hex"));
    }
    // Log the current level's hashes
    console.log(
      "Current level hashes: ",
      nextLevel.map((hash) => hash.toString("hex")),
    );

    level = nextLevel;
  }

  return "Ox" + level[0].toString("hex");
}

// Main hash function
function shaHashingFunction() {
  // Prompt User for the Number of Transactions
  const numTxs = parseInt(
    readline.question("Enter number of transactions: "),
    10,
  );

  // Check if the user input character (s) or a number less than 0
  if (isNaN(numTxs) || numTxs < 0) {
    console.error("Invalid number");
    return;
  }

  // Check if the number of transaction is equal to zero
  if (numTxs === 0) {
    console.error("Please input a number greater than 0");
    return;
  }

  // Initiate the transaction hashes array
  const transactionHashes: string[] = [];

  for (let i = 0; i < numTxs; i++) {
    // Prompt the user to enter a string to generate each the transaction hash
    const inputStr = readline.question(
      `Enter string for transaction ${i + 1}: `,
    );
    // Derive transaction hash from input string using Keccak256 (simulating tx hash derivation)
    const txHash = ethers.sha256(ethers.toUtf8Bytes(inputStr));
    console.log(`Derived Tx Hash ${i + 1}: ${txHash}`);
    console.log(`The length of the Tx Hash is: ${i + 1}: ${txHash.length}`);

    // Append transaction hash to the array
    transactionHashes.push(txHash);

    console.log("");
  }

  // Merkle Root Calculation
  const sha256Root = buildMerkleRoot(transactionHashes, sha256Hash);
  console.log("\n Merkle Root with SHA256: ", sha256Root);
}

function keccakHashingFunction() {
  // Prompt User for the Number of Transactions
  const numTxs = parseInt(
    readline.question("Enter number of transactions: "),
    10,
  );

  // Check if the user input character (s) or a number less than 0
  if (isNaN(numTxs) || numTxs < 0) {
    console.error("Invalid number");
    return;
  }

  // Check if the number of transaction is equal to zero
  if (numTxs === 0) {
    console.error("Please input a number greater than 0");
    return;
  }

  // Initiate the transaction hashes array
  const transactionHashes: string[] = [];

  for (let i = 0; i < numTxs; i++) {
    // Prompt the user to enter a string to generate each the transaction hash
    const inputStr = readline.question(
      `Enter string for transaction ${i + 1}: `,
    );
    // Derive transaction hash from input string using Keccak256 (simulating tx hash derivation)
    const txHash = ethers.keccak256(ethers.toUtf8Bytes(inputStr));
    console.log(`Derived Tx Hash ${i + 1}: ${txHash}`);
    console.log(`The length of the Tx Hash is: ${i + 1}: ${txHash.length}`);

    // Append transaction hash to the array
    transactionHashes.push(txHash);

    console.log("");
  }

  // Merkle Root Calculation
  const keccak256Root = buildMerkleRoot(transactionHashes, keccak256Hash);
  console.log("\n Merkle Root with Keccak256: ", keccak256Root);
}

// Run the gas fee calculator
calculateGasFee();

// Run the hashing functions
shaHashingFunction();
keccakHashingFunction();








