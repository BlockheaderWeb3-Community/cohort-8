import Web3 from "web3";

// Algorithm to derive block hash
/* function deriveBlockHeaderHash(blockHeader):
    serializedBlockHeader = serialize(blockHeader)
    hash = keccak256(serializedBlockHeader)
    return hash
*/

function deriveBlockHeaderHash(blockHeader) {
  const serializedBlockHeader = JSON.stringify(blockHeader);
  const hash = Web3.utils.keccak256(serializedBlockHeader);
  return hash;
}

const exampleBlockHeader = {
  parentHash: "0xabc345...",
  number: 2876543,
  timestamp: 1625247800,
  // ... other block header fields
};

const blockHash = deriveBlockHeaderHash(exampleBlockHeader);
console.log("Derived Block Hash:", blockHash);