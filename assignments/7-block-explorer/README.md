# Mini Ethereum Block Explorer

A simple **beginner‑friendly Ethereum block explorer** built with **vanilla JavaScript** using the **Ethereum JSON‑RPC API**.
This project fetches and displays the **latest Ethereum blocks and transactions** directly from a public Ethereum node — no backend required.

---

## Features

* Fetches the **latest Ethereum blocks**
* Displays:

  * Block number
  * Block hash
  * Miner (validator address)
  * Transaction count
* Shows a **preview of transactions** per block
* Clickable blocks that navigate to a **block details page**
* Uses a **public Ethereum RPC endpoint**

---

## How It Works (High Level)

1. The app sends **JSON‑RPC requests** to an Ethereum node
2. It fetches the **latest block number**
3. It walks backwards through the blockchain to get recent blocks
4. Each block is rendered into the DOM
5. Transactions are truncated for readability

---

## Ethereum RPC Used

This project uses a public Ethereum RPC endpoint:

```
https://ethereum.publicnode.com
```

RPC methods used:

* `eth_blockNumber` → get latest block number
* `eth_getBlockByNumber` → fetch block data

---

## Project Structure (Example)

```
mini-block-explorer/
├── index.html
├── block.html
├── style.css
├── script.js
└── README.md
```

---

## Running the Project

1. Clone the repository

```bash
git clone <your-repo-url>
```

2. Open `index.html` in your browser

> No build tools or servers required — pure HTML, CSS, and JavaScript.

---

## Core Code Concepts Explained

### JSON‑RPC Call

All Ethereum data is fetched using this helper:

```js
async function rpcCall(method, params = [])
```

* Sends a JSON‑RPC request
* Returns `data.result` from the Ethereum node

---

### Fetch Latest Block Number

```js
eth_blockNumber
```

* Returns the latest block number in **hexadecimal**
* Converted to decimal using `parseInt(hex, 16)`

---

### Fetch a Block

```js
eth_getBlockByNumber
```

Parameters:

* Block number (hex)
* `true` → include full transaction objects

---

### Walking Backwards Through the Blockchain

```js
getBlock(latest - i)
```

This fetches:

| i | Block    |
| - | -------- |
| 0 | Latest   |
| 1 | Previous |
| 2 | Older    |

---

### Transaction Preview

Transactions are shortened for readability:

```js
tx.hash.slice(0, 12)
tx.from.slice(0, 10)
tx.to?.slice(0, 10)
```

Optional chaining (`?.`) prevents crashes when `tx.to` is `null` (contract creation).

---

## Limitations

* Uses a **public RPC** (rate limits may apply)
* No pagination or caching
* No ENS resolution
* No internal transactions

---

## Future Improvements

* Block details page with full transaction list
* Address page (EOA vs contract detection)
* ENS name resolution
* Pagination / infinite scroll
* Local RPC support (Geth / Nethermind)

---

## Learning Goals

This project helps beginners understand:

* Ethereum blocks & transactions
* JSON‑RPC
* Async JavaScript (`async/await`)
* Hex vs decimal numbers
* DOM manipulation
* How real block explorers work internally

---

## Acknowledgements

* Ethereum JSON‑RPC specification
* Public Ethereum RPC providers

---

## Author

Built as a learning project while exploring **Ethereum internals + frontend development**.

---

## License

MIT License — free to use, modify, and learn from.
