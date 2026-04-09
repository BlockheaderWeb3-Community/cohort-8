# Escrow Smart Contract System

A Solidity smart contract system for secure ETH escrow transactions between a buyer and seller, overseen by an agent.

---

## Overview

* **Escrow Contract** – Handles a single escrow transaction:

  * Seller deposits ETH
  * Buyer confirms delivery
  * Agent releases funds or refunds
* **EscrowFactory Contract** – Deploys and manages multiple Escrow contracts:

  * Buyers create new escrow agreements with sellers
  * Tracks deployed escrows in an array
  * Provides helper functions to retrieve escrow count and addresses

---

## Example Usage (TypeScript)

### Deploy EscrowFactory

```ts
import { ethers } from "hardhat";
import { EscrowFactory, Escrow } from "../typechain-types";

async function main() {
  const [deployer, buyer, seller] = await ethers.getSigners();

  // Deploy Factory
  const factoryFactory = await ethers.getContractFactory("EscrowFactory");
  const factory = (await factoryFactory.deploy()) as EscrowFactory;
  await factory.deployed();

  console.log("Factory deployed at:", factory.target);

  // Buyer creates a new escrow
  const tx = await factory.connect(buyer).createEscrow(seller.address);
  await tx.wait();

  // Retrieve deployed escrow address
  const escrowAddress = await factory.getEscrow(0);
  const escrow = (await ethers.getContractAt("Escrow", escrowAddress)) as Escrow;

  console.log("Escrow deployed at:", escrowAddress);
}
```

---

### Seller Funds Escrow

```ts
const fundTx = await escrow.connect(seller).fundEscrow({
  value: ethers.parseEther("5")
});
await fundTx.wait();
console.log("Escrow funded by seller with 5 ETH");
```

---

### Buyer Confirms Delivery

```ts
const confirmTx = await escrow.connect(buyer).confirmDelivery();
await confirmTx.wait();
console.log("Buyer confirmed delivery");
```

---

### Agent Releases Funds to Seller

```ts
const releaseTx = await escrow.connect(deployer).releaseFunds(); // deployer is agent
await releaseTx.wait();
console.log("Agent released funds to seller");
```

---

### Agent Refunds Buyer

```ts
const refundTx = await escrow.connect(deployer).refundBuyer();
await refundTx.wait();
console.log("Agent refunded buyer");
```

---

### Getting Escrow Details

```ts
const amount = await escrow.amountReceived();
const status = await escrow.status();
const currentBuyer = await escrow.buyer();
const currentSeller = await escrow.seller();

console.log("Amount in escrow:", ethers.formatEther(amount), "ETH");
console.log("Escrow status:", status);
console.log("Buyer:", currentBuyer);
console.log("Seller:", currentSeller);
```

---

### Factory Helper Functions

```ts
// Total escrows
const totalEscrows = await factory.getEscrowCount();
console.log("Total Escrows:", totalEscrows);

// Get escrow address by index
const firstEscrowAddr = await factory.getEscrow(0);
console.log("Escrow[0] address:", firstEscrowAddr);
```

---
