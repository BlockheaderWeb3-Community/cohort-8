# Ethereum Block Explorer

A lightweight, frontend-only Ethereum block explorer built with vanilla JavaScript and ethers.js. It connects live to the Ethereum mainnet and lets users browse recent blocks, recent transactions, and search for specific blocks or transactions by their identifiers.

---

## Project Structure

```
project/
├── index.html              → The UI layout (the only HTML file)
├── styles.css              → All the styling
└── explorerjs/
    ├── connection.js       → Sets up the connection to Ethereum
    ├── fetch.js            → Fetches data from the blockchain
    ├── display.js          → Updates the UI with fetched data
    ├── main.js             → The entry point; ties everything together
    └── test.js             → Used to test individual functions in the console
```

---

## File-by-File Breakdown

---

### 1. connection.js — The Bridge to Ethereum

```javascript
import { ethers } from 'ethers';
const ETHEREUM_API_KEY = "6c54b451816345c7894af520f9f011a4"
const ETHEREUM_RPC_URL = `https://mainnet.infura.io/v3/${ETHEREUM_API_KEY}`

const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

export { provider };
```

**What it does:**
This file does one job — it creates a `provider`. A provider in ethers.js is essentially a connection to the Ethereum network. Think of it like a socket or a handshake between your app and the blockchain. Every time you want to ask Ethereum a question (like "what's the latest block?" or "what are the details of this transaction?"), you go through this provider.

**Why it exists as its own file:**
The provider is used by multiple other files (mainly `fetch.js`). Keeping it in its own file means there's only one place where the connection is created and configured. If you ever need to switch from Infura to another provider (like Alchemy), you only change it here — nothing else in the app needs to know.

**Key parts:**
- `ETHEREUM_API_KEY` — Your Infura account key. This gives you access to Infura's Ethereum node.
- `ETHEREUM_RPC_URL` — The full URL that points to Ethereum's mainnet through Infura. RPC stands for Remote Procedure Call; it's how your app sends requests to the blockchain.
- `ethers.JsonRpcProvider(url)` — This is an ethers.js v6 class that creates the provider using that RPC URL. It handles all the HTTP communication with Ethereum behind the scenes.
- `export { provider }` — Makes the provider available to other files that import it.

---

### 2. fetch.js — Fetching Data from the Blockchain

```javascript
import { provider } from "./connection.js";
```

This file imports the provider from `connection.js` and uses it to make all blockchain requests. It exports four functions, each responsible for fetching a specific type of data.

---

#### `getRecentBlocks(count)`

Fetches the most recent blocks on Ethereum.

**How it works step by step:**
1. It calls `provider.getBlockNumber()` to get the number of the very latest block on the chain.
2. It then loops backwards from that block number, fetching `count` number of blocks one by one using `provider.getBlock()`.
3. Each block is pushed into an array, and the full array is returned at the end.

**Why it works this way:**
Ethereum doesn't have a single API call that says "give me the last 20 blocks." You have to fetch them one at a time. So the function first finds out what the latest block number is, then counts backwards to grab as many as you need.

---

#### `getRecentTransactions(count)`

Fetches the most recent transactions across the chain.

**How it works step by step:**
1. It gets the latest block number.
2. It fetches that block using `provider.getBlock(blockNumber, true)`. The second argument `true` is important — it tells ethers.js to return the full transaction objects inside the block, not just transaction hashes.
3. It loops through the transactions in that block (accessed via `block.prefetchedTransactions`) and adds them to an array.
4. If that block didn't have enough transactions, it moves to the previous block and repeats.
5. It keeps going until it has collected enough transactions, then returns exactly `count` of them using `.slice()`.

**Why it works this way:**
A single block can have anywhere from 0 to hundreds of transactions. You can't guarantee that one block will have enough to fill your list. So the function keeps going back through blocks until it collects the number you asked for.

**Why `prefetchedTransactions` and not `transactions`?**
When you pass `true` as the second argument to `getBlock()`, ethers.js populates `prefetchedTransactions` with full transaction objects (containing `from`, `to`, `value`, `hash`, etc.). The regular `transactions` array in that case only contains hashes.

---

#### `searchByBlockNumber(block)`

Fetches details of a single block by its block number.

**How it works:**
It simply calls `provider.getBlock(block)` with the block number you pass in. If the block is found, it returns the full block object. If not, it throws an error.

**Why the error handling matters:**
If the block doesn't exist (e.g., you search for a block number that hasn't been mined yet), `provider.getBlock()` returns `null`. The function checks for this and throws a clear error message. It then re-throws the error using `throw error` so that whatever called this function knows something went wrong and can handle it (like showing an alert to the user).

---

#### `searchTxHash(txHash)`

Fetches details of a single transaction by its hash.

**How it works:**
It calls `provider.getTransaction(txHash)` with the transaction hash. The same error handling pattern applies — if the transaction isn't found, it throws an error and re-throws it so the caller can respond.

**Why re-throw?**
If you only `console.log` the error and don't re-throw, the function silently returns `undefined`. The code that called it has no idea something went wrong, and the app just stops doing anything without feedback. Re-throwing lets the error bubble up to the caller, where it can be caught and turned into a user-facing message.

---

### 3. display.js — Updating the UI

```javascript
import { ethers } from "ethers";
```

This file imports ethers only for its utility functions (`formatEther`, `formatUnits`) — it doesn't interact with the blockchain at all. Its entire job is to take data that `fetch.js` returns and render it into the HTML.

---

#### Helper Functions

**`shortenHash(hash)`**
Takes a long Ethereum hash like `0x1234567890abcdef...` and shortens it to something like `0x12345678...cdef` for display. Full hashes are 66 characters long and would break the layout if shown in full.

**`getTimeAgo(timestamp)`**
Converts a block's Unix timestamp (seconds since 1970) into a human-readable relative time like "5 mins ago" or "2 hours ago". This makes the UI feel more natural than showing raw timestamps.

---

#### `displayBlocks(blocks)`

Takes an array of block objects and turns them into HTML, then inserts that HTML into the `blocksList` element in the page.

**What it renders for each block:**
- The block number
- The miner address (shortened)
- How many transactions are in the block
- Gas usage as a percentage (gasUsed / gasLimit × 100)
- How long ago the block was mined

**Why it uses `.map().join("")`:**
`.map()` transforms each block object into an HTML string. `.join("")` combines all those strings into one big string with no separator. This is then set as the `innerHTML` of the container, which renders all blocks at once. Doing it this way is faster than creating and appending DOM elements one by one.

**Why `onclick="handleBlockClick(...)"`:**
Each block card has a click handler baked into the HTML. When clicked, it calls `handleBlockClick` (defined on `window` in `main.js`) and passes the block number. This is how navigation from the block list to the block detail view is triggered.

---

#### `displayTransactions(txs)`

Works exactly like `displayBlocks`, but for transactions. It renders each transaction's hash, sender, recipient, and ETH value. It uses `ethers.formatEther()` to convert the raw wei value (the smallest unit of ETH) into a readable ETH number.

---

#### `showBlockDetails(block)`

Takes a single block object and renders a full detail view showing everything: block number, timestamp (converted to a readable date), number of transactions, miner, gas used, gas limit, base fee, and the block hash.

It uses `ethers.formatUnits(block.baseFeePerGas, "gwei")` to convert the base fee from wei into Gwei, which is the standard unit gas fees are displayed in.

After rendering the content, it calls `showView("blockDetail")` to switch the page from the main view to the block detail view.

---

#### `showTransactionDetails(tx)`

Same concept as `showBlockDetails`, but for a single transaction. It displays the transaction hash, which block it belongs to, sender, recipient (or "Contract Creation" if there's no recipient), and the ETH value.

---

#### `showView(viewName)`

Controls which view is currently visible on the page. The app has multiple "views" — the main list view, the block detail view, and the transaction detail view — but only one is shown at a time.

**How it works:**
1. It first hides everything by setting `mainView` to `display: none` and removing the `active` class from all detail views.
2. It then shows only the view you asked for — either by setting `mainView` back to `display: block`, or by adding the `active` class to the appropriate detail view.

This is how the app navigates between screens without reloading the page.

---

### 4. main.js — The Entry Point

This is the central file that ties the entire app together. It imports functions from both `fetch.js` and `display.js` and connects them.

---

#### Window Functions (Click Handlers)

Because the HTML uses inline `onclick` attributes (like `onclick="handleBlockClick(...)"`), the functions need to be accessible globally — meaning they need to live on the `window` object. ES module functions are scoped to their file by default and aren't accessible from inline HTML handlers, so `main.js` attaches them to `window` explicitly.

- **`window.handleBlockClick(blockNumber)`** — When a block card is clicked, this fetches the full block details and shows the block detail view.
- **`window.handleTxClick(txHash)`** — When a transaction card is clicked, this fetches the transaction details and shows the transaction detail view.
- **`window.showMain()`** — Called by the "Back to Main" button on detail views. Switches back to the main list view.
- **`window.closeError()`** — Hides the error message box if one is shown.

---

#### `window.handleSearch()`

Handles the search bar. It reads whatever the user typed, figures out what type of search it is, and calls the right function.

**How it determines the search type:**
- If the input is all numbers (`/^\d+$/`), it's treated as a block number.
- If it starts with `0x` and is exactly 66 characters long, it's treated as a transaction hash. (All Ethereum transaction hashes are exactly 66 characters: `0x` + 64 hex characters.)
- Anything else shows an alert saying the input is invalid.

After a successful search, it clears the input field. If anything goes wrong, the error is caught and shown to the user as an alert.

---

#### `init()`

This is the function that runs when the page first loads. It fetches the initial data (recent blocks and transactions) and tells the display functions to render them. If anything fails during this process, it catches the error and alerts the user.

---

#### `init();`

The last line of the file. This actually calls `init()` and starts the whole app. Without this line, nothing would happen when the page loads.

---

### 5. test.js — Testing Individual Functions

This file exists purely for development and debugging. It imports the same functions from `fetch.js` and calls them individually so you can see the raw output in the browser console.

It contains four test functions, each one testing a different piece of functionality:

- **`testBlock()`** — Tests that `getRecentBlocks()` correctly fetches and returns block data.
- **`testTransactions()`** — Tests that `getRecentTransactions()` correctly fetches and returns transaction data.
- **`testSearchBlock()`** — Tests searching for a specific block by number and logs all its properties.
- **`testSearchTx()`** — Tests searching for a specific transaction by hash.

Only one test function is uncommented at a time to avoid hitting Infura's rate limits. To run a test, uncomment the function call at the bottom, point your HTML script tag to `test.js`, reload, and check the console.

---

## How the App Flows (Start to Finish)

1. The browser loads `index.html`, which loads `main.js` as a module.
2. `main.js` runs `init()`.
3. `init()` calls `getRecentBlocks(30)` and `getRecentTransactions(30)` from `fetch.js`.
4. `fetch.js` uses the `provider` from `connection.js` to talk to Ethereum and get the data.
5. The data comes back to `init()`, which passes it to `displayBlocks()` and `displayTransactions()` in `display.js`.
6. `display.js` builds HTML from that data and inserts it into the page. The blocks and transactions now appear on screen.
7. When a user clicks a block or transaction, the corresponding `window.handleBlockClick` or `window.handleTxClick` fires, fetches the details, and switches to the detail view.
8. When the user clicks "Back to Main", `showMain()` switches back to the main list view.

---

## Dependencies

- **ethers.js v6** — Used to connect to Ethereum and interact with the blockchain. Loaded via an import map in the HTML pointing to a CDN.
- **Infura** — A third-party service that provides access to an Ethereum node. Your app doesn't run its own node; instead, it sends requests to Infura, which forwards them to the Ethereum network.