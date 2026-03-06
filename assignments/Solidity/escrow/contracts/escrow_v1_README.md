# Escrow V1 Contract

A basic Ethereum smart contract that facilitates a secure three-party escrow transaction between a buyer, seller, and escrow agent.

## Overview

Escrow V1 implements a simple escrow mechanism where funds are held by the contract until goods are delivered and confirmed by the buyer. The escrow agent then releases the funds to the seller.

## Contract Details

- **Solidity Version**: ^0.8.26
- **License**: MIT

## Actors

| Role | Description |
|------|-------------|
| **Buyer** | Deposits funds into escrow and confirms receipt of goods |
| **Seller** | Delivers goods and receives payment upon successful completion |
| **Escrow** | Manages the transaction and releases funds to the seller |

## State Variables

- `buyer` - Address of the buyer
- `seller` - Address of the seller  
- `escrow` - Address of the escrow agent (deployer)
- `hasDeposited` - Boolean flag indicating if buyer has deposited funds
- `balances` - Mapping of addresses to their balances
- `buyerStatMapping` - Mapping of buyer addresses to their status
- `sellerStatMapping` - Mapping of seller addresses to their status

## Enums

### BuyerStatus
- `AWAITING_DELIVERY` - Buyer has deposited but hasn't received goods
- `COMPLETE` - Buyer has received goods and confirmed

### SellerStatus
- `AWAITING_PAYMENT` - Seller has delivered goods but hasn't been paid
- `COMPLETE` - Seller has received payment

## Functions

### Constructor
```solidity
constructor(address _seller, address _buyer)
```
Initializes the escrow with seller and buyer addresses. The deployer becomes the escrow agent.

### deposit()
```solidity
function deposit() public payable
```
Allows the buyer to deposit funds into the escrow. 
- Requires: Caller must be the buyer
- Requires: Deposit amount must be greater than 0
- Updates buyer status to `AWAITING_DELIVERY`

### deliverGoods()
```solidity
function deliverGoods() public
```
Called by the seller to indicate goods have been delivered.
- Requires: Caller must be the seller
- Updates seller status to `AWAITING_PAYMENT`

### receivedGoods()
```solidity
function receivedGoods() public
```
Called by the buyer to confirm receipt of goods.
- Requires: Caller must be the buyer
- Updates buyer status to `COMPLETE`

### releaseFunds()
```solidity
function releaseFunds() public
```
Releases the escrowed funds to the seller.
- Requires: Caller must be the escrow agent
- Requires: Contract balance must equal buyer's deposited amount
- Requires: Buyer status must be `COMPLETE`
- Transfers funds to seller and updates seller status to `COMPLETE`

## Workflow

1. **Deployment**: Escrow deploys contract with buyer and seller addresses
2. **Deposit**: Buyer calls `deposit()` to send funds to escrow
3. **Delivery**: Seller calls `deliverGoods()` to indicate delivery
4. **Confirmation**: Buyer calls `receivedGoods()` to confirm receipt
5. **Release**: Escrow calls `releaseFunds()` to pay the seller

## Security Considerations

- Only the buyer can deposit funds
- Only the escrow agent can release funds
- Funds are only released after buyer confirms receipt
- Reentrancy protection via checks-effects-interactions pattern (using `.call()`)
