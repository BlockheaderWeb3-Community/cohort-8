# JSON RPC METHODS

## What is `JSON RPC` in Ethereum?
JSON-RPC is just a way for your app to talk to an Ethereum node.
**Think of it like this:**
- Ethereum node = a server that knows the blockchain
- JSON-RPC = the language you use to ask it questions or give it instructions
- You send a JSON message
- The node replies with JSON

### Basic structure of a JSON-RPC request
Every request looks roughly like this:
```rust
{
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

```
**In here,**
`jsonrpc` => The JSON-RPC protocol version
`method` => What you eant to do
`params` => data you pass in
`id` => This is the request ID

## Main Ethereum JSON-RPC Method Groups
Ethereum methods are grouped by prefix:

Prefix	Purpose
eth_	Core Ethereum blockchain operations
net_	Network info
web3_	Client utilities
debug_	Debugging (advanced)
trace_	Execution tracing (advanced)





## Essential Ethereum JSON-RPC Methods (Beginner List)
### 1️⃣ Blockchain Info
`eth_blockNumber`
📦 Get the latest block number
```
"What is the most recent block?"
```
Used for:
syncing
checking chain progress

`eth_getBlockByNumber`
📦 Get block details by block number
"Give me block #18000000"
Can return:
- transactions
- block hash
- miner
- timestamp

`eth_getBlockByHash`
📦 Get block details using block hash
```rust
"Give me the block with this hash"
```

### 2️⃣ Accounts & Balances
`eth_getBalance`
💰 Get ETH balance of an address
```
"How much ETH does this address have?"
```
Returns balance in wei (smallest ETH unit).

`eth_getTransactionCount`
🔢 Get nonce for an address
"How many transactions has this address sent?"
Important for:
- creating transactions
- preventing replay



### 3️⃣ Transactions
`eth_getTransactionByHash`
📨 Get transaction details
```
"Show me this transaction"
```


`eth_getTransactionReceipt`
🧾 Check if transaction succeeded or failed
Returns:
- status (success/fail)
- gas used
- logs (events)



`eth_sendRawTransaction`
🚀 Send a signed transaction
```
"Broadcast this already-signed transaction"
```
NOTE: Node does not sign for you,
Wallet signs → node broadcasts



### 4️⃣ Smart Contracts
`eth_call`
🤖 Call a contract function (read-only)
"Call this function, but don’t change state"
Used for:
reading contract data
no gas cost
instant response

`eth_estimateGas`
⛽ Estimate gas for a transaction
"How much gas will this transaction need?"


`eth_getCode`
📜 Get contract bytecode
"Is there a contract at this address?"
If result is 0x → no contract.

### 5️⃣ Logs & Events
`eth_getLogs`
📡 Get smart-contract events
"Show me all Transfer events for this token"
Used heavily by:
indexers
explorers
analytics

### 6️⃣ Network Info
`net_version`
🌐 Get chain ID
"Which network is this?"

Examples:
1 → Ethereum Mainnet
5 → Goerli (deprecated)
11155111 → Sepolia

`net_peerCount`
👥 How many peers connected

### 7️⃣ Utility Methods
`web3_clientVersion`
🧠 Get node software info
"Geth? Nethermind? Erigon?"


`web3_sha3`
🔐 Keccak-256 hash
"Hash this data the Ethereum way"

**Example: Balance Check in Plain English**
> App → Node:
> “What’s the balance of 0xABC... at the latest block?”

That’s just:
```rust
eth_getBalance(address, "latest")
```


