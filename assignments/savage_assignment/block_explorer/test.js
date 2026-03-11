import {
  getRecentBlocks,
  getRecentTransactions,
  searchByBlockNumber,
  searchTxHash,
} from "./explorerjs/fetch.js";


// Testing to see if the blocks where called.

async function testBlock() {
  console.log("Getting 20 recent block...");
  const blk = await getRecentBlocks(30);

  console.log(`Got ${blk.length} blocks`);
  console.log("First block called.", blk[0]);
}

testBlock();

// Testing to see if transactions are being called.
async function testTransactions() {
  console.log("Getting 5 recent transactions...");
  const txs = await getRecentTransactions(30);

  console.log(`Got ${txs.length} transactions`);
  console.log("First transaction:", txs[0]);
}

testTransactions();

// Testing to see if the block was shown
async function testSearchBlock() {
  const block = await searchByBlockNumber(21500000);
  console.log("Block details:", block);

  // To see all properties individually:
  console.log("Block number:", block.number);
  console.log("Block hash:", block.hash);
  console.log("Timestamp:", block.timestamp);
  console.log("Miner:", block.miner);
  console.log("Number of transactions:", block.transactions.length);
}

testSearchBlock();

// Testng to see if the transactions shows
async function testSearchTx() {
  const block = await searchTxHash(
    "0xbe33e6bf44e4c0d6ce7ab29ac5c098de1d654799f442f89347dc8f72c4a1df25",
  );
  console.log("Tx details:", block);
}

testSearchTx();
