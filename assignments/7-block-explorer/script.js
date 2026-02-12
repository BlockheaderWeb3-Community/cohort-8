const RPC_URL = "https://ethereum.publicnode.com";

async function rpcCall(method, params = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 1
    })
  });

  const data = await response.json();
  return data.result;
}


async function getLatestBlockNumber() {
  const hexBlockNumber = await rpcCall("eth_blockNumber");
  return parseInt(hexBlockNumber, 16);
}


async function getBlock(blockNumber) {
  const hexNumber = "0x" + blockNumber.toString(16);
  return await rpcCall("eth_getBlockByNumber", [hexNumber, true]);
}


async function getLatestBlocks(count = 6) {
  const latest = await getLatestBlockNumber();

  const blocks = [];
  for (let i = 0; i < count; i++) {
    const block = await getBlock(latest - i);
    blocks.push(block);
  }

  return blocks;
}

function renderBlocks(blocks) {
   const container = document.getElementById("blocks");
  container.innerHTML = "";

  blocks.forEach(block => {
    const blockNumber = parseInt(block.number, 16);

    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    blockDiv.style.cursor = "pointer";

    blockDiv.addEventListener("click", () => {
      window.location.href = `block.html?number=${blockNumber}`;
    });

    blockDiv.innerHTML = `
          <div class="block-header">
        Block #${parseInt(block.number, 16)}
      </div>
      <div>Hash: ${block.hash}</div>
      <div>Miner: ${block.miner}</div>
      <div>Tx Count: ${block.transactions.length}</div>
      <hr />
      <div class="space"></div>
    `;

     const txs = block.transactions.slice(0, 5);

    txs.forEach(tx => {
      const txDiv = document.createElement("div");
      txDiv.className = "tx";
      txDiv.textContent =
        `${tx.hash.slice(0, 12)}... | from ${tx.from.slice(0, 10)} → ${tx.to?.slice(0, 10)}`;
      blockDiv.appendChild(txDiv);
    });


    container.appendChild(blockDiv);
  });

}




document.getElementById("loadBlock").addEventListener("click", async () => {
  const container = document.getElementById("blocks");
  container.textContent = "Loading latest blocks...";

  try {
    const blocks = await getLatestBlocks(10);
    renderBlocks(blocks);
  } catch (err) {
    container.textContent = "Error fetching blocks";
    console.error(err);
  }
});


























////// RESPONSE FOR eth_getBlockByNumber
// ---> REQUEST
// { 
// "jsonrpc":"2.0",
// "method":"eth_getBlockByNumber",
// "params":["0x10d4f", true],
// "id":1 
// }


// {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "result": {
//         "difficulty": "0x1d95715bd14",
//         "extraData": "0x",
//         "gasLimit": "0x2fefd8",
//         "gasUsed": "0x5208",
//         "hash": "0x7eb7c23a5ac2f2d70aa1ba4e5c56d89de5ac993590e5f6e79c394e290d998ba8",
//         "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
//         "miner": "0xf927a40c8b7f6e07c5af7fa2155b4864a4112b13",
//         "mixHash": "0x13dd2c8aec729f75aebcd79a916ecb0f7edc6493efcc6a4da8d7b0ab3ee88444",
//         "nonce": "0xc60a782e2e69ce22",
//         "number": "0x10d4f",
//         "parentHash": "0xf8d01370e6e274f8188954fbee435b40c35b2ad3d4ab671f6d086cd559e48f04",
//         "receiptsRoot": "0x0c44b7ed0fefb613ec256341aa0ffdb643e869e3a0ebc8f58e36b4e47efedd33",
//         "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
//         "size": "0x275",
//         "stateRoot": "0xd64a0f63e2c7f541e6e6f8548a10a5c4e49fda7ac1aa80f9dddef648c7b9e25f",
//         "timestamp": "0x55c9ea07",
//         "transactions": [
//             {
//                 "blockHash": "0x7eb7c23a5ac2f2d70aa1ba4e5c56d89de5ac993590e5f6e79c394e290d998ba8",
//                 "blockNumber": "0x10d4f",
//                 "from": "0x4458f86353b4740fe9e09071c23a7437640063c9",
//                 "gas": "0x5208",
//                 "gasPrice": "0xba43b7400",
//                 "hash": "0xa442249820de6be754da81eafbd44a865773e4b23d7c0522d31fd03977823008",
//                 "input": "0x",
//                 "nonce": "0x1",
//                 "to": "0xbf3403210f9802205f426759947a80a9fda71b1e",
//                 "transactionIndex": "0x0",
//                 "value": "0xaa9f075c200000",
//                 "type": "0x0",
//                 "v": "0x1b",
//                 "r": "0x2c2789c6704ba2606e200e1ba4fd17ba4f0e0f94abe32a12733708c3d3442616",
//                 "s": "0x2946f47e3ece580b5b5ecb0f8c52604fa5f60aeb4103fc73adcbf6d620f9872b"
//             }
//         ],
//         "transactionsRoot": "0x4a5b78c13d11559c9541576834b5172fe8b18507c0f9f76454fcdddedd8dff7a",
//         "uncles": []
//     }
// }