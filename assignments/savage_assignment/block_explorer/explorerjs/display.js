import { ethers } from "ethers";

// Get all DOM elements
const blocksList = document.getElementById("blocksList");
const transactionsList = document.getElementById("transactionsList");
const blockDetailContent = document.getElementById("blockDetailContent");
const txDetailContent = document.getElementById("txDetailContent");
const addressDetailContent = document.getElementById("addressDetailContent");
const mainView = document.getElementById("mainView");
const blockDetail = document.getElementById("blockDetail");
const txDetail = document.getElementById("txDetail");
const addressDetail = document.getElementById("addressDetail");
const blockNumberSpan = document.getElementById("blockNumber");

// Helper: Shorten hash
function shortenHash(hash) {
  return hash.substring(0, 10) + "..." + hash.substring(hash.length - 6);
}

// Helper: Time ago
function getTimeAgo(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  return `${Math.floor(diff / 3600)} hours ago`;
}

// 1. Display blocks
export function displayBlocks(blocks) {
  const html = blocks
    .map((block) => {
      const gasPercent = (
        (Number(block.gasUsed) / Number(block.gasLimit)) *
        100
      ).toFixed(1);
      const timeAgo = getTimeAgo(block.timestamp);

      return `
      <div class="item" onclick="handleBlockClick(${block.number})">
        <div class="item-left">
          <div class="item-icon">📦</div>
          <div class="item-details">
            <span class="item-label">Block</span>
            <span class="item-value">${block.number}</span>
            <span class="item-sub">Miner ${shortenHash(block.miner)}</span>
            <span class="item-sub">${block.transactions.length} txns</span>
          </div>
        </div>
        <div class="item-right">
          <div class="amount">${gasPercent}% Gas</div>
          <div class="time">${timeAgo}</div>
        </div>
      </div>
    `;
    })
    .join("");

  blocksList.innerHTML = html;
}

// 2. Display transactions
export function displayTransactions(txs) {
  const html = txs
    .map((tx) => {
      const value = ethers.formatEther(tx.value);

      return `
      <div class="item" onclick="handleTxClick('${tx.hash}')">
        <div class="item-left">
          <div class="item-icon">📄</div>
          <div class="item-details">
            <span class="item-label">Tx</span>
            <span class="item-value">${shortenHash(tx.hash)}</span>
            <span class="item-sub">From ${shortenHash(tx.from)}</span>
            <span class="item-sub">To ${tx.to ? shortenHash(tx.to) : "Contract"}</span>
          </div>
        </div>
        <div class="item-right">
          <div class="amount">${parseFloat(value).toFixed(4)} ETH</div>
          <div class="time">Just now</div>
        </div>
      </div>
    `;
    })
    .join("");

  transactionsList.innerHTML = html;
}

// 3. Show block details
export function showBlockDetails(block) {
  const timestamp = new Date(block.timestamp * 1000).toLocaleString();
  const baseFee = ethers.formatUnits(block.baseFeePerGas, "gwei");

  blockNumberSpan.textContent = block.number;
  blockDetailContent.innerHTML = `
    <div class="detail-row">
      <div class="detail-label">Block Number:</div>
      <div class="detail-value">${block.number}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Timestamp:</div>
      <div class="detail-value">${timestamp}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Transactions:</div>
      <div class="detail-value">${block.transactions.length}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Miner:</div>
      <div class="detail-value">${block.miner}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Gas Used:</div>
      <div class="detail-value">${block.gasUsed.toString()}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Gas Limit:</div>
      <div class="detail-value">${block.gasLimit.toString()}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Base Fee:</div>
      <div class="detail-value">${parseFloat(baseFee).toFixed(4)} Gwei</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Hash:</div>
      <div class="detail-value">${block.hash}</div>
    </div>
  `;

  showView("blockDetail");
}

// 4. Show transaction details
export function showTransactionDetails(tx) {
  const value = ethers.formatEther(tx.value);

  txDetailContent.innerHTML = `
    <div class="detail-row">
      <div class="detail-label">Hash:</div>
      <div class="detail-value">${tx.hash}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Block:</div>
      <div class="detail-value">${tx.blockNumber}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">From:</div>
      <div class="detail-value">${tx.from}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">To:</div>
      <div class="detail-value">${tx.to || "Contract Creation"}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Value:</div>
      <div class="detail-value">${parseFloat(value).toFixed(6)} ETH</div>
    </div>
  `;

  showView("txDetail");
}

// 5. Show/hide views
export function showView(viewName) {
  mainView.style.display = "none";
  blockDetail.classList.remove("active");
  txDetail.classList.remove("active");
  addressDetail.classList.remove("active");

  if (viewName === "mainView") {
    mainView.style.display = "block";
  } else if (viewName === "blockDetail") {
    blockDetail.classList.add("active");
  } else if (viewName === "txDetail") {
    txDetail.classList.add("active");
  }
}
