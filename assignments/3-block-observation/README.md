# Observations on a Block explorer(Etherscan) and a Transaction hash


### 1. Exploring the block explorer
While on the block explorer, I observed some standard metrics which were:
- Ether price: This gives the current market value of one `ether`
- Market cap: Short for market capitalisation, it is calculated by multiplying the current value of ether by the total circulating supply.
- Transactions: This shows the total number of transactions processed in ethereum over a period of time.
- Last finalised block: This is the most recent block that have ben finalized or confirmed by the consensus mechanism
- Latest blocks: This shows recent blocks that have been added to the blockchain
- Latest transaction: This shows all the recent transaction that were mined in a block.

### 2. Exploring a block on etherscan (Block explorer)
After clicking on a recent block under the `Latest blocks` section, there were some details I observed which were:
- Block Height: It shows the number in which the block is positioned, right from the genesis block. It shows the length of the blockchain.
- Status: It shows if a block is fiinalised/confirmed
- Timestamp: It shows the date and time at which the block was created.
- Transactions: Shows the number of transactions the block carries
- Fee recipient: This is the address of the block that receives transaction fees/gas fees
- Block reward: This is the reward given to a block producer/validator
- Block difficulty: This is the total difficulty of the chain up until the recent recent block.

### 3. Exploring a transaction hash
<!-- While on my rabby wallet, I wanted to view my transaction history, so I clicked on the `Transactions` icon, and selected the option `Custom network`, there I saw the transactions I made then selected the particular one I wanted, after clicking I observed some details like: -->
- **Sending ETH to my address**
On my rabby wallet, I clicked on `Send` button which prompted me to input an amount and put in the receivers' address, since I'm sending to myself, I inputted my wallet address. After that I clicked `Send` then I signed and confirmed the transaction. Immediately I was redirected to `etherscan.io`, there I observed some details like:
- Transaction hash: It is unique identifier that is generated cryptographically when a transaction is created, it's more like a proof that a transaction a has gone through.
- Status: This shows if a transaction was successful or not
- Block: This shows the block height which this transaction is included.
- Timestamp: The date a time in which this transaction was created.
- From:  Senders' address
- To: Receivers' address
- Value: The value of ETH I'm spending

## Conclusion
The ethereum block explorer is a powerful tool that shows in real time the processes and production of blocks and transactions.
As well as a transaction hash that serves as a proof that an exchange of value has already taken place.