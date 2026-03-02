import { ethers } from "ethers";

const transactions = [
  "Chibex sent 100USD",
  "Emma sent 150USD",
  "David sent 150USD",
  "Joy sent 150USD",
  "Chief sent 150USD",
  "Mama sent 150USD",
];

const hashLeaves = (txns, hashFn) =>
  txns.map((t) => hashFn(ethers.toUtf8Bytes(t)));

const buildMerkleRoot = (hashes, hashFn) => {
  if (hashes.length === 1) return hashes[0];

  const nextLevel = [];
  for (let i = 0; i < hashes.length; i += 2) {
    if (i + 1 < hashes.length) {
      const combined = ethers.concat([hashes[i], hashes[i + 1]]);
      nextLevel.push(hashFn(combined));
    } else {
      nextLevel.push(hashes[i]); 
    }
  }
  console.log("Next level:", nextLevel);
  return buildMerkleRoot(nextLevel, hashFn);
};

const leavesSha = hashLeaves(transactions, ethers.sha256);
console.log("Leaves (SHA256):", leavesSha);
const rootSha1 = buildMerkleRoot(leavesSha, ethers.sha256);
console.log(`Merkle Root (SHA256): ${rootSha1}`);

const leavesKec = hashLeaves(transactions, ethers.keccak256);
const rootKec1 = buildMerkleRoot(leavesKec, ethers.keccak256);
console.log(`Merkle Root (Keccak256): ${rootKec1}`);