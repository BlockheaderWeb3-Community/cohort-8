const RPC_URL = "https://ethereum.publicnode.com";

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function rpcCall(method, params = []) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 1
    })
  });
  const data = await res.json();
  return data.result;
}

async function loadBlock() {
  const blockNumber = getQueryParam("number");
  if (!blockNumber) return;

  const hex = "0x" + Number(blockNumber).toString(16);
  const block = await rpcCall("eth_getBlockByNumber", [hex, true]);

  document.getElementById("title").textContent =
    `Block #${parseInt(block.number, 16)}`;

  document.getElementById("blockInfo").innerHTML = `
    <div>Hash: ${block.hash}</div>
    <div>Miner: ${block.miner}</div>
    <div>Gas Used: ${parseInt(block.gasUsed, 16)}</div>
    <div>Transactions: ${block.transactions.length}</div>
    <hr />
  `;

  const txsDiv = document.getElementById("txs");

  block.transactions.forEach(tx => {
    const txDiv = document.createElement("div");
    txDiv.className = "tx";
    txDiv.textContent =
      `${tx.hash} | from ${tx.from} → ${tx.to ?? "Contract Creation"}`;
    txsDiv.appendChild(txDiv);
  });
}

loadBlock();
