WHAT is AN RPC? An RPC stands for (Remote Procedure Call)a protocol that allows a program to execute a function or procedure on another computer/server as if it were a local function call.

JSON RPC ON THE BLOCKCHAIN JSON-RPC is used as the communication protocol between a client and a blockchain node. It allows to query blockchain data (like account balances, transaction history,or block info) and send transactions to the network.the JSON-RPC methods vary by blockchain, and also the methods are divided into (two) (A)read operations and (B) write operations

\*\*KEY DIFFRENCES

aspect read methods write method
cost free requirs gas(Eth)
speed instant wait for block confirmation
stage change no yes
signing not required must be signed
. COMMON PATTERN OF JSON-RPC ACROSS MAJOR BLOCKCHAIN

Common Patterns Across Blockchains:

category bitcoin ethereum solana
Block height getblockcount eth_blockNumber getBlockHeight
Balance getbalance eth_getBalance getBalance
Send TX sendrawtransaction eth_sendRawTransaction sendTransaction
block data getblock eth_getBlockByNumber getBlock
TX details gettransaction eth_getTransactionByHash getTransaction
In summary: JSON-RPC is how applications talk to blockchain nodes programmatically.
