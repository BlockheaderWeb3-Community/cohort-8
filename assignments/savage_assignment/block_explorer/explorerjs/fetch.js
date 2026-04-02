import { provider } from "./connection.js";

// Function to get recent blocks created.
export async function getRecentBlocks(count) {
  try {
    const latestBlockNumber = await provider.getBlockNumber();
    let blocksArray = [];
    for (let i = 0; i < count; i++) {
      let block = await provider.getBlock(latestBlockNumber - i);
      blocksArray.push(block);
      console.log(blocksArray);
    }
    return blocksArray;
  } catch (error) {
    console.log("Couldn't get block number", error);
  }
}

// Function to fetch recently confirmed transactions in the chain

export async function getRecentTransactions(count) {
  let transactions = []; // empty array to store transactions
  let currentBlockNumber = await provider.getBlockNumber(); // get the latest block number

  // keep fecthcing blocks until it's enough
  while (transactions.length < count) {
    // get blocks with full transaction objects
    const block = await provider.getBlock(currentBlockNumber, true);
    // console.log(block);

    // add transactions from this block into the array
    // prefetchedTransactions: array of full transaction objects( with from, to, value, etc.)
    for (const tx of block.prefetchedTransactions) {
      transactions.push(tx);

      // stop when e don reach
      if (transactions.length >= count) {
        break;
      }
    }

    // move back to previous block
    currentBlockNumber--;
  }

  console.log(transactions);

  // return exactly the amount of transactions called.
  return transactions.slice(0, count);
}

// FUNCTIONS FOR SEARCHING BLOCKS AND TRANSACTIONS.

// searching block number
export async function searchByBlockNumber(block) {
  try {
    const searchBlock = await provider.getBlock(block);
    if (!searchBlock) throw new Error("Block not found");
    return searchBlock;
  } catch (error) {
    console.log("Couldn't get block...", error);
    throw error; // re-throw so the caller knows it failed
  }
}

// searching for transactions with transaction hash
export async function searchTxHash(txHash) {
  try {
    const searchTx = await provider.getTransaction(txHash);
    if (!searchTx) throw new Error("Transaction not found");
    return searchTx;
  } catch (error) {
    console.log("Couldn't get tx...", error);
    throw error;
  }
}

