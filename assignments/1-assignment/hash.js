// libraries
import crypto from "crypto";             // For SHA-256
import { keccak256, toUtf8Bytes, getBytes } from "ethers"; // For Keccak-256

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function keccak256HashBytes(data) {
  // data can be a string or Uint8Array
  const bytes = typeof data === "string" ? toUtf8Bytes(data) : data;
  return keccak256(bytes); // returns 0x... hex string
}

// --- Generic Merkle Root function ---
function merkleRoot(transactions, algo = "sha256") {
  if (!transactions || transactions.length === 0) return null;

  // hashing of transactions
  let hashes = transactions.map(tx => {
    if (algo === "sha256") return sha256(tx);
    else if (algo === "keccak256") return keccak256HashBytes(tx);
    else throw new Error("Unknown algorithm: " + algo);
  });

  // iteratively compute parent hashes
  while (hashes.length > 1) {
    let temp = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = i + 1 < hashes.length ? hashes[i + 1] : hashes[i]; // duplicate last if odd

      if (algo === "sha256") {
        temp.push(sha256(left + right)); // SHA-256: hex string concat
      } else {
        // Keccak-256: convert hex strings to bytes, then concatenate
        const leftBytes = getBytes(left.startsWith("0x") ? left : "0x" + left);
        const rightBytes = getBytes(right.startsWith("0x") ? right : "0x" + right);
        const combined = new Uint8Array([...leftBytes, ...rightBytes]);
        temp.push(keccak256(combined));
      }
    }
    hashes = temp;
  }

  return hashes[0]; // final root
}

// demo transactions
const transactions = [
  "Alice pays Bob 1 ETH",
  "Carol pays Dave 2 ETH",
  "Eve pays Frank 0.5 ETH",
  "George pays Hannah 0.1 ETH"
];

console.log("=== Transaction Hashes ===");
console.log("\nSHA-256 Transaction Hashes:");
transactions.forEach((tx, index) => {
  console.log(`  [${index}] ${sha256(tx)}`);
});

console.log("\nKeccak-256 Transaction Hashes:");
transactions.forEach((tx, index) => {
  console.log(`  [${index}] ${keccak256HashBytes(tx)}`);
});

const shaRoot = merkleRoot(transactions, "sha256");
const keccakRoot = merkleRoot(transactions, "keccak256");

console.log("\n=== Merkle Roots ===");
console.log("SHA-256 Merkle Root:", shaRoot);
console.log("Keccak-256 Merkle Root:", keccakRoot);
