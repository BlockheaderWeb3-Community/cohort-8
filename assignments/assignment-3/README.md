-JSON is an acronym for JavaScript oblect Notation, it is a way of transporting data between computers.

-RPC is an acronym for Remote Procedure Call. It is a way to execute methods remotely.

JSON-RPC is a lightweight, stateless protocol for remote procedure calls using JSON. It defines a standardized way for clients to invoke methods on servers, handle responses, and manage errors. The latest version, JSON-RPC 2.0, is widely used in APIs, blockchain systems (like Ethereum and Bitcoin), and distributed applications.  

---

 Core Concepts of JSON-RPC
- Transport-independent: Works over HTTP, WebSockets, TCP, or even in-process communication.
- Stateless: Each request is independent; no session is required.
- Lightweight: Uses JSON for encoding, making it easy to parse and implement.
- Bidirectional: Supports client-to-server and server-to-client communication.

---

 JSON-RPC Versions
| Version | Year | Key Features |
|---------|------|--------------|
| 1.0 | 2005 | Basic request/response, positional parameters only. |
| 1.1 WD | 2006 | Added named parameters, error codes, introspection functions. |
| 1.1 Alt | 2007 | Alternative proposal with simplified structure. |
| 2.0 | 2010 | Standardized specification, supports notifications, batch requests, named parameters, and improved error handling.  |

---

 Structure of JSON-RPC Messages

1. Request Object
`json
{
  "jsonrpc": "2.0",
  "method": "subtract",
  "params": [42, 23],
  "id": 1
}
`
- jsonrpc: Must be "2.0".
- method: The name of the method to invoke or the function you want to call. 
- params: Arguments to the function (can be positional array or named object).
- id: Unique identifier for matching responses.

2. Response Object
`json
{
  "jsonrpc": "2.0",
  "result": 19,
  "id": 1
}
`
- result: The return value of the method.
- id: Matches the request ID.

3. Error Object
`json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}
`
- error: Contains code, message, and optional data.

---

 Types of JSON-RPC Methods
1. Standard Request/Response
   - Client sends a request with id, server replies with result.
2. Notification
   - Request without id. It is mainly used where the client does not need comfirmation, but the client would not be aware of any errors ( like "invalid params", "internal errors" ) No response expected.
   `json
   { "jsonrpc": "2.0", "method": "update", "params": [1,2,3] }
   `
3. Batch Requests
   - Multiple requests sent in one array; responses can be asynchronous.
   `json
   [
     { "jsonrpc": "2.0", "method": "sum", "params": [1,2,3], "id": 1 },
     { "jsonrpc": "2.0", "method": "notify", "params": [7] }
   ]
   `

---

 Error Codes in JSON-RPC 2.0
| Code | Meaning |
|------|---------|
| -32700 | Parse error (invalid JSON). |
| -32600 | Invalid request object. |
| -32601 | Method not found. |
| -32602 | Invalid parameters. |
| -32603 | Internal error. |
| -32000 to -32099 | Server-defined errors.  |

---

 Use Cases
- Blockchain: Ethereum and Bitcoin nodes expose JSON-RPC APIs for wallet operations, transactions, and querying blockchain state.
- Microservices: Lightweight RPC between distributed services.
- Web Applications: Communication between frontend and backend over WebSockets or HTTP.

---

 Limitations & Considerations
- No built-in authentication/authorization: Must be handled externally.
- Transport layer security: Needs HTTPS or TLS for secure communication.
- Error handling: Must be carefully implemented to avoid silent failures.
- Scalability: Batch requests help, but large-scale systems may need additional orchestration. 

---

 In summary: JSON-RPC methods provide a simple, standardized way to perform remote procedure calls using JSON. They support requests, responses, notifications, and batch operations, with robust error handling defined in the 2.0 specification. While powerful and widely adopted, developers must add authentication, security, and scalability features externally.  