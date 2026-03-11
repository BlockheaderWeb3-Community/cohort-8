// import from fetch.js
import {
  getRecentBlocks,
  getRecentTransactions,
  searchByBlockNumber,
  searchTxHash,
} from "./fetch.js";

// import from display.js
import {
  displayBlocks,
  displayTransactions,
  showBlockDetails,
  showTransactionDetails,
  showView,
} from "./display.js";

// GLOBAL CLICK HANDLERS

// Handler for when a block is clicked
window.handleBlockClick = async (blockNumber) => {
  try {
    const block = await searchByBlockNumber(blockNumber);
    showBlockDetails(block);
  } catch (error) {
    console.log("Error loading block:", error);
    alert("Failed to load block");
  }
};

// Handler for when a tx is clicked
window.handleTxClick = async (txHash) => {
  try {
    const tx = await searchTxHash(txHash);
    showTransactionDetails(tx);
  } catch (error) {
    console.log("Error Loading Tx:", error);
    alert("Failde to load Tx");
  }
};

//
window.showMain = () => {
  showView("mainView");
};

window.closeError = () => {
  document.getElementById("searchError").classList.remove("active");
};

// search function.
window.handleSearch = async () => {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value.trim();

  if (!query) {
    alert("Please enter something to search");
    return;
  }

  try {
    // If it's just numbers → block number
    if (/^\d+$/.test(query)) {
      const block = await searchByBlockNumber(parseInt(query));
      if (block) {
        showBlockDetails(block);
      } else {
        alert("Block not found. Try a different block number.");
      }
    }
    // If it starts with 0x and 66 chars → transaction hash
    else if (query.startsWith("0x") && query.length === 66) {
      const tx = await searchTxHash(query);
      showTransactionDetails(tx);
    } else {
      alert("Invalid search query. Enter a block number or transaction hash.");
    }

    searchInput.value = ""; // Clear search
  } catch (error) {
    console.error("Search error:", error);
    alert("Search failed: " + error.message);
  }
};

// initalize the app
async function init() {
  console.log("Starting Block Explorer...");

  try {
    // Fetch initial data
    console.log("Loading blocks and transactions...");

    const blocks = await getRecentBlocks(20);
    const transactions = await getRecentTransactions(20);

    // Display them
    displayBlocks(blocks);
    displayTransactions(transactions);

    console.log("✓ Block Explorer ready!");
  } catch (error) {
    console.error("Failed to initialize:", error);
    alert("Failed to load blockchain data. Check console.");
  }
}

// Start the app when page loads
init();
