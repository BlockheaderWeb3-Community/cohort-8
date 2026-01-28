# RPCs

At its core, **RPC** stands for **Remote Procedure Call**. It is a protocol that allows a program to request a service from another program across a network, without needing to understand the complex network details.

In the context of blockchain, RPCs bridge the communication gap between a user (or dApp) and the blockchain network. They allow applications to read data (like account balances) or send transactions.

**Ethereum RPCs** are the specific protocols used to talk to Ethereum nodes. They are essential for:
* Enabling decentralized applications to communicate with the blockchain.
* Deploying, testing, and interacting with smart contracts.
* Accessing real-time data and transaction status.


## Types of Ethereum RPCs

### A. JSON-RPC 
**JSON-RPC** is the primary and most versatile type used in Ethereum. It is a **stateless**, lightweight protocol that uses JSON format to encode requests. It typically runs over **HTTP**. This is the standard "on the blockchain" method used for most request-response interactions, such as querying a block number or sending a transaction.

### B. WebSockets
**WebSockets** provide a vital communication channel for real-time applications over the network. Unlike stateless HTTP, WebSockets establish a **persistent, full-duplex connection**. This allows continuous data exchange in both directions without opening a new connection for every request. It is crucial for live dashboards or monitoring tools that need instant updates (e.g., "Tell me immediately when this transaction is mined").

### C. Named Pipes 
**Named Pipes** (or IPC - Inter-Process Communication) serve a specific purpose for local administration. This mechanism does **not** run over the network. It uses a file on the computer's hard drive to allow communication between processes on the *same* machine. This is the "one not running" on the public network. It is used for secure, local interactions with a node (like a system admin giving commands to a Geth node) because it is faster and more secure than opening a network port.

## JSON-RPC & Client Execution

JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol. It defines several data structures and the rules around their processing. It is transport agnostic in that the concepts can be used within the same process, over sockets, over http, or in many various message passing environments.

A standard JSON-RPC request to an Execution Client (like Geth or Nethermind) looks like this:

```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "latest"],
  "id": 1
}
```
* jsonrpc: Specifies the version of the protocol (usually "2.0").

* **method:** The name of the method to be invoked (e.g., eth_getBalance, eth_sendRawTransaction).

* **params:** A structured value that holds the parameter values to be used during the invocation of the method.

*  **id:** An identifier established by the client that MUST contain a String, Number, or NULL value if included.

### Methods for Executing Clients (The Engine API)

While standard users use the eth_ namespace (like eth_getBalance), Executing Clients use a specialized set of RPC methods to communicate with Consensus Clients (Beacon Nodes). This collection of methods is known as the Engine API.

This is crucial for the "Merge" architecture of Ethereum, where the Consensus Layer instructs the Execution Layer on what to do.

### Key Engine RPC Methods:

* engine_newPayloadV1:

This method is used by the Consensus Layer to provide the Execution Layer with a new block payload (transactions, state root, etc.) to be executed and verified. It effectively tells the execution client, "Here is a block, execute these transactions and tell me if it is valid."

* engine_forkchoiceUpdatedV1:

This method updates the fork choice state of the execution client. It tells the execution client which block is the new "head" of the chain and which block is "finalized". It ensures the execution client stays in sync with the consensus logic (Proof of Stake).

* engine_getPayloadV1:

This is used when the validator connected to this node is chosen to propose a block. It requests the execution client to build a new block filled with transactions.

### Namespace Categories
Different JSON-RPC methods are grouped into "namespaces" based on their functionality:

* eth: General blockchain interaction (e.g., eth_blockNumber, eth_call).

* net: Network status (e.g., net_version, net_listening).

* web3: Utility functions (e.g., web3_clientVersion).

* admin: (Restricted) Node management (e.g., admin_addPeer).

* debug: (Restricted) Replaying transactions and tracing (e.g., debug_traceTransaction).

### JSON-RPC Interaction Patterns
While the protocol is uniform, requests can take three distinct forms based on the requirement:

1.  **Standard Request:**
    The client sends a request object with a unique `id`. The server *must* reply with a response object containing the same `id`. This is the default behavior for querying data (e.g., `eth_getBalance`).

2.  **Notification:**
    A request object that **omits the `id` member**. This indicates that the client is not interested in a response (fire-and-forget). The server does not send a reply. This is rarely used in standard Ethereum node queries but is valid in the protocol specification for logging or alerts.

3.  **Batch Request:**
    Instead of sending a single request object, the client sends an **array** of request objects. The server responds with an array of response objects. This allows the client to send multiple unrelated queries (e.g., getting block number, gas price, and balance) in a single HTTP request, significantly reducing network latency.