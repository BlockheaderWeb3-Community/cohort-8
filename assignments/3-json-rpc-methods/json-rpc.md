# **Assignment 26/01/25**

**JSON RPC**
JSON-RPC is a stateless, lightweight remote procedure call protocol that uses JSON to:

* call a method on a remote server
* pass parameters
* get a result or an error

It is very popular in blockchain systems like Ethereum, Bitcoin, Solana, etc.

---

**Basic JSON RPC Structure**
Every request has 4 main fields:
```
{
  "jsonrpc": "2.0",
  "method": "method_name",
  "params": [],
  "id": 1
}

```
* jsonrpc: always 2.0 for modern implementations
* method: The fucnction you're trying to call on the server
* params: usually the arguements for the method. Can be an array or an object
* id: used to match request to responses


---

**Responses**
There are good responses and bad ones(errors). Remember that a json rpc response can only have one or the other not both.

Successful Response:
```
{
  "jsonrpc": "2.0",
  "result": "some value",
  "id": 1
}

```

Error response:
```
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}

```


---

**Common JSON RPC error codes**
| Code   | Meaning                |
| ------ | ---------------------- |
| -32700 | Parse error (bad JSON) |
| -32600 | Invalid request        |
| -32601 | Method not found       |
| -32602 | Invalid params         |
| -32603 | Internal error         |

These are some of the universal codes. Blockchain nodes often add custom codes on top of these

---

**Notification**
A notification is a request that does not have an id, meaning the server doesn't have to return anything therefore **no response**. Used for logging, analytics, fire-and-forget events

```
{
  "jsonrpc": "2.0",
  "method": "log_event",
  "params": ["User logged in"]
}

```

---

**Batch Requests**
You can send multiple requests in one call
```
[
  {
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "id": 1
  },
  {
    "jsonrpc": "2.0",
    "method": "eth_gasPrice",
    "id": 2
  }
]

```

This is usually done when talking to nodes

---
### **Ethereum Nodes Read and Write Methods**
Look at it like this:
Read = asking the blockchain a question(Not changing any state)
Write = asking the blockchain to remember something forever(changing state of the chain)

**Common READ JSON RPC Methods**
1. eth_call: Used to read smart contract data
2. eth_getBalance: Used to get ETH Balance of a wallet
3. eth_blockNumber: Returns the current block height
4. eth_getTransactionReceipt: Check transaction status
5. eth_getLogs: Read emitted events from contracts

**Common WRITE JSON RPC Methods**
1. eth_sendRawTransaction:
```
{
  "jsonrpc": "2.0",
  "method": "eth_sendRawTransaction",
  "params": ["0xSignedTransaction"],
  "id": 1
}

```

Used ofr:
* token transfer
* contract interaction
* contract deployment

The most important write method. But transations must already be signed first 

2. eth_estimateGas: Simulates a write to estimate gas
3. eth_sendTransaction: Rare but this allows the node to sign the transaction for you. Mostly disabled on public nodes

---
JSON-RPC itself is **transport-agnostic**. It can run over:

* HTTP / HTTPS (most common)
* WebSockets (real-time blockchain updates)
* IPC (local node communication)

Same JSON. Different pipes.

But!

JSON-RPC does not include **authentication** or **authorization**.

Security is handled by:
* API keys (Infura, Alchemy)
* network restrictions
* reverse proxies
* rate limiting

Never expose a raw node endpoint publicly.