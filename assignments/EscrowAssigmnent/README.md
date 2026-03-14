## Escrow Smart Contract

A secure on-chain escrow contract that facilitates trustless transactions between a buyer and a seller, with an escrow agent acting as a neutral mediator.
The contract ensures funds are only released when delivery is confirmed or disputes are resolved, with optional automatic release after a timeout.

### 📌 Overview

This escrow system enables:
Secure ETH deposits by a buyer
Seller delivery confirmation
Controlled fund release by an escrow agent
Dispute handling and resolution
Automatic release after a timeout
Refunds when necessary
It is suitable for freelance work, marketplace transactions, and peer-to-peer commerce.

### 👥 Roles

- Buyer
  Deposits funds into escrow
  Can raise disputes
- Seller
  Confirms delivery
  Can raise disputes
- Escrow Agent
  Deployer of the contract
  Releases funds
  Issues refunds
  Resolves disputes
  Collects escrow fees

### ⚙️ Escrow Lifecycle

1️⃣ Awaiting Payment
Contract deployed
Buyer deposits ETH via deposit()
2️⃣ Awaiting Delivery
Seller delivers goods/services
Seller calls confirmDelivery()
3️⃣ Completion
Escrow agent releases funds
Seller receives payment
Agent receives fee
4️⃣ Refund
Agent refunds buyer if needed
5️⃣ Dispute
Buyer or seller raises dispute
Agent resolves in favor of either party
💰 Fees
Defined in basis points
100 = 1%
Max allowed: 10% (1000 basis points)
Collected only when seller is paid

contract address: 0xf99919a45050f413A7BdbEF9D1E6450973E0935d
etherscan_link:
(etherscan_link)[https://eth-sepolia.blockscout.com/address/0xf99919a45050f413A7BdbEF9D1E6450973E0935d#code]
