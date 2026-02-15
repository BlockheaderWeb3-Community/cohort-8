# Escrow V2 Contract

An enhanced Ethereum smart contract that builds upon V1 with additional features including a time-based lock mechanism, buyer account tracking, and a factory pattern for deploying multiple escrow instances.

## Overview

Escrow V2 extends the V1 functionality with time-locked refunds, delivery verification, and an EscrowFactory for creating new escrow contracts programmatically.

## Contract Details

- **Solidity Version**: ^0.8.26
- **License**: MIT

---

## Escrow Contract

### Actors

| Role | Description |
|------|-------------|
| **Buyer** | Deposits funds into escrow, confirms receipt of goods |
| **Seller** | Delivers goods and receives payment upon successful completion |
| **Escrow** | Manages the transaction and releases funds to the seller |

### Additional State Variables (V2)

- `haveSentGoods` - Boolean flag indicating if seller has delivered goods
- `buyerInitialAccount` - Tracks buyer's initial balance before deposit
- `locktime` - Timestamp when funds become eligible for refund

### Enums

### BuyerStatus
- `AWAITING_DELIVERY` - Buyer has deposited but hasn't received goods
- `COMPLETE` - Buyer has received goods and confirmed

### SellerStatus
- `AWAITING_PAYMENT` - Seller has delivered goods but hasn't been paid
- `COMPLETE` - Seller has received payment

### New Functions in V2

#### deposit()
Enhanced with locktime mechanism:
```solidity
function deposit() public payable
```
- Records buyer's initial account balance
- Sets a 15-second locktime from deposit
- Buyer can get refund after locktime expires

#### deliverGoods()
Enhanced with deposit verification:
```solidity
function deliverGoods() public
```
- Requires buyer to have deposited funds first
- Sets `haveSentGoods` flag to true

#### receivedGoods()
Enhanced with delivery verification:
```solidity
function receivedGoods() public
```
- Requires seller to have called `deliverGoods()` first

#### refundBuyer()
New function for time-based refunds:
```solidity
function refundBuyer() public
```
- Can only be called by the contract itself
- Requires locktime to have passed (`block.timestamp >= locktime[buyer]`)
- Transfers remaining balance to seller (note: naming suggests buyer refund but code transfers to seller - potential bug)

---

## EscrowFactory Contract

A factory contract for deploying multiple Escrow instances.

### State Variables

- `identifier` - Counter for tracking deployed escrows

### Functions

#### createEscrow()
```solidity
function createEscrow(address _seller, address _buyer) external returns(address)
```
Creates a new Escrow contract with specified buyer and seller.
- Increments the identifier counter
- Returns the address of the newly created Escrow contract

### Use Case

The factory pattern allows:
- Deploying multiple independent escrow contracts
- Tracking all escrows via the identifier
- Automated escrow creation from other smart contracts

## Workflow

1. **Deployment**: Use EscrowFactory to create new escrow OR deploy Escrow directly
2. **Deposit**: Buyer calls `deposit()` - 15-second locktime starts
3. **Delivery**: Seller calls `deliverGoods()` (requires prior deposit)
4. **Confirmation**: Buyer calls `receivedGoods()` (requires prior delivery)
5. **Release**: Escrow calls `releaseFunds()` to pay the seller
6. **Refund (Optional)**: After locktime expires, refund can be triggered

## Security Considerations

### V2 Improvements
- `haveSentGoods` flag prevents premature confirmation
- Locktime provides deadline for delivery
- Factory pattern enables scalable deployment

### Potential Issues
- The `refundBuyer()` function transfers to seller instead of buyer (line 105)
- Locktime is very short (15 seconds) - may need adjustment for production
- No check for transaction success in `refundBuyer()`

### General Security
- Only the buyer can deposit funds
- Only the escrow agent can release funds
- Funds are only released after buyer confirms receipt
- Uses `.call()` for value transfer (reentrancy safe)

## Comparison: V1 vs V2

| Feature | V1 | V2 |
|---------|----|----|
| Basic Escrow Flow | ✅ | ✅ |
| Deposit Function | ✅ | ✅ (enhanced) |
| Delivery Verification | ❌ | ✅ |
| Locktime Mechanism | ❌ | ✅ |
| Refund Function | ❌ | ✅ |
| EscrowFactory | ❌ | ✅ |
| Buyer Balance Tracking | ❌ | ✅ |
