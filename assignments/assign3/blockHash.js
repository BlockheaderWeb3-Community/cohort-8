const crypto = require("crypto");

function deriveBlockHash(block) {
  const blockString = JSON.stringify({
    nonce: block.nonce || 0,
    index: block.index,
    timestamp: block.timestamp,
    data: block.data,
    previousHash: block.previousHash,
  });

  return crypto.createHash("sha256").update(blockString).digest("hex");
}
const block = {
  nonce: 1,
  index: 1,
  timestamp: Date.now(),
  data: "niffy",
  previousHash: "123456789",
};

const hash = deriveBlockHash(block);
console.log("Block Hash:", hash);