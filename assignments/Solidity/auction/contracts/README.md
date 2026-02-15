# AuctionContract

A Solidity smart contract for creating and managing Ethereum auctions.

## Overview

`AuctionContract` is an Ethereum smart contract that enables users to create auctions, place bids, and manage the auction lifecycle. It handles bid tracking, automatic refunds to outbid bidders, and secure transfer of funds to the auction owner upon completion.

## Contract Details

- **Solidity Version**: ^0.8.26
- **License**: MIT

## Structs

### Auction

| Field | Type | Description |
|-------|------|-------------|
| `id` | uint | Unique identifier for the auction |
| `startingPrice` | uint | Minimum bid price set by the owner |
| `status` | AuctionStatus | Current status of the auction |
| `owner` | address | Address of the auction creator |
| `highestBidder` | address | Address of the current highest bidder |
| `highestBid` | uint | Current highest bid amount |
| `startTime` | uint | Timestamp when the auction started |
| `duration` | uint | Duration of the auction in seconds |

## Enums

### AuctionStatus

| Value | Description |
|-------|-------------|
| `Pending` | Auction created but not yet started |
| `OnGoing` | Auction is active and accepting bids |
| `Completed` | Auction has ended successfully |
| `Cancelled` | Auction was cancelled |

## State Variables

- `auctionCounter` (uint): Tracks the total number of auctions created
- `auctions` (mapping): Maps auction ID to Auction struct
- `refunds` (mapping): Tracks refundable amounts for bidders per auction

## Functions

### createAuction

Creates a new auction with a specified starting price and duration.

```solidity
function createAuction(uint _price, uint _duration) public returns(uint)
```

**Parameters:**
- `_price`: Minimum starting price for the auction
- `_duration`: Duration in seconds (minimum 600 seconds / 10 minutes)

**Requirements:**
- `_price` must be greater than 0
- `_duration` must be at least 600 seconds

**Returns:** The ID of the newly created auction

### startAuction

Starts a pending auction, making it active and accepting bids.

```solidity
function startAuction(uint _auctionsId) public
```

**Parameters:**
- `_auctionsId`: ID of the auction to start

**Requirements:**
- Caller must be the auction owner
- Auction status must be `Pending`

### bid

Places a bid on an active auction.

```solidity
function bid(uint auction_id) external payable returns(bool)
```

**Parameters:**
- `auction_id`: ID of the auction to bid on

**Requirements:**
- Caller cannot be the auction owner
- `msg.value` must be greater than 0
- Auction status must be `OnGoing`
- Total bid (including previous bids) must exceed the current highest bid

**Behavior:**
- Previous highest bidder receives a refund
- New bid becomes the highest bid

### endAuction

Ends an auction after the specified duration has passed.

```solidity
function endAuction(uint _auctionId) external
```

**Parameters:**
- `_auctionId`: ID of the auction to end

**Requirements:**
- Auction status must be `OnGoing`
- Auction duration must have elapsed

**Behavior:**
- Transfers the highest bid to the auction owner
- Sets auction status to `Completed`

### refundBidders

Allows outbid bidders to withdraw their refundable funds.

```solidity
function refundBidders(uint _auctionId) external
```

**Parameters:**
- `_auctionId`: ID of the auction

**Requirements:**
- Caller must have a refundable balance greater than 0

### refundsGetterFunction

View function to check refundable amount for an address.

```solidity
function refundsGetterFunction(uint _id, address addr) public view
```

## Events

### AuctionInitialaized

Emitted when a new auction is created.

```solidity
event AuctionInitialaized(uint id)
```

## Usage Example

```solidity
// Create an auction with 1 ETH starting price and 1 hour duration
uint auctionId = auctionContract.createAuction(1 ether, 3600);

// Start the auction
auctionContract.startAuction(auctionId);

// Place a bid of 1.5 ETH
auctionContract.bid{value: 1.5 ether}(auctionId);

// End the auction (after duration elapses)
auctionContract.endAuction(auctionId);

// Outbid users can claim refunds
auctionContract.refundBidders(auctionId);
```

## Security Considerations

1. **Reentrancy Protection**: The contract uses `.call{}` for Ether transfers which is safer than `.transfer()` or `.send()`.
2. **Owner Validation**: Only the auction owner can start or end their auctions.
3. **Self-bid Prevention**: Auction owners cannot bid on their own auctions.
4. **Refund Tracking**: Automatically tracks and refunds outbid bidders.
5. **Duration Validation**: Minimum auction duration of 10 minutes prevents short-duration auctions.

## Error Messages

- `"non zero price"` - Starting price must be greater than 0
- `"minimum 10mins for auction time"` - Duration must be at least 600 seconds
- `"Not your Auction"` - Only owner can perform this action
- `"invalid auction Status"` - Operation not allowed in current auction state
- `"You can't bid on your own auction"` - Owner cannot bid on their own auction
- `"Send Eth greater than zero"` - Bid amount must be positive
- `"Bid must be higher than current highesst bid"` - New bid must exceed current highest
- `"Auction not ended yet"` - Cannot end before duration elapses
- `"No refund available"` - No funds to refund
- `"Bid transfer failed"` - Ether transfer failed
