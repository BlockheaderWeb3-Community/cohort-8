Escrow Smart Contract

A simple escrow system written in Solidity (^0.8.28).

It allows a buyer to deposit ETH, and the seller receives payment only after delivery is confirmed.

The project also includes an EscrowFactory contract to create multiple escrow contracts.

How It Works
1️⃣ Create Escrow

Using EscrowFactory, a new escrow contract is created with:

Buyer address

Seller address

Each escrow is a separate contract.

2️⃣ Buyer Deposits ETH

deposit()

Only buyer can call

Must send ETH

Escrow status changes from PENDING → PAID

3️⃣ Confirm Delivery

confirmDelivery()

Only buyer can call

ETH is sent to seller

Status changes to COMPLETE

4️⃣ Refund Buyer

refundBuyer()

Only buyer can call

ETH is returned to buyer

Status changes to REFUNDED

Escrow Status

PENDING → Waiting for payment

PAID → Buyer has deposited ETH

COMPLETE → Seller has been paid

REFUNDED → Buyer received refund

EscrowFactory

The factory contract allows you to:

Create new escrow contracts

Store all escrow addresses

Get total number of escrows

Retrieve all escrows

Simple Flow

Create Escrow → Buyer deposits →
Either:

Confirm delivery → Seller gets paid 💰
OR

Refund → Buyer gets money back

Use Cases

Online purchases

Freelance payments

Peer-to-peer transactions

Secure ETH transfers between two parties