# Escrow Factory Contract

A decentralized escrow service using a Factory pattern.

## Features
- **Factory Pattern**: Deploys unique Escrow contracts for every order.
- **Security**: Funds are locked in the individual Escrow contract until the buyer confirms receipt.

- **Workflow**: 
  1. `createOrder`: Buyer initializes the trade.
  2. `deposit`: Buyer locks ETH.
  3. `confirmReceipt`: Buyer releases ETH to Seller.
  4. **Repeat**