# Auction Smart Contract

A Solidity smart contract for running a simple ETH-based auction with highest-bid logic, time-limited bidding, and refunds for non-winning bidders.

---

## Overview

This contract allows the owner to create an auction with:

* A starting price in ETH
* A fixed duration (auction length)
* Users can place bids higher than the current highest bid
* After the auction ends, the highest bidder wins
* Non-winning bidders can claim refunds

---

## Contract Details

* **License**: MIT
* **Solidity Version**: ^0.8.28

---

## State Variables

| Variable        | Type    | Description                       |
| --------------- | ------- | --------------------------------- |
| `owner`         | address | Auction creator/owner             |
| `highestBid`    | uint    | Current highest bid in wei        |
| `highestBidder` | address | Address of current highest bidder |
| `isActive`      | bool    | Auction status (active/inactive)  |
| `timeOver`      | uint    | Timestamp when auction ends       |
| `bids`          | mapping | Tracks all user bids              |

---

## Constructor

### constructor(uint _startingPrice, uint _auctionLength)

Initializes the auction.

**Parameters:**

* `_startingPrice` → Minimum bid amount in wei
* `_auctionLength` → Auction duration in seconds

**Access:** Anyone (during deployment)

**Requirements:**

* Starting price must be greater than 0
* Auction length must be greater than 0
* Deploying address becomes owner

**Notes:**

* Auction is active upon deployment
* `timeOver` is set as `block.timestamp + _auctionLength`

---

## Functions

---

### placeBid()

Allows users to place a bid.

**Access:** Anyone except the owner

**Requirements:**

* Caller cannot be owner
* Auction must be active
* Bid must be higher than `highestBid`
* Current time must be less than `timeOver`

**Notes:**

* Bid amount is added to caller’s total in `bids` mapping
* Updates `highestBid` and `highestBidder`
* Emits `NewHighestBid` event

---

### endAuction()

Ends the auction and allows the owner to collect the highest bid.

**Access:** Owner only

**Requirements:**

* Auction must be active
* Auction time must be over
* Caller must be owner

**Notes:**

* Sets `isActive` to false
* Emits `AuctionEnded` event
* Sends `highestBid` to the owner

---

### refunds()

Allows non-winning bidders to claim their ETH back.

**Access:** Non-winning bidders

**Requirements:**

* Caller cannot be the winner
* Auction must be inactive
* Caller must have bid funds

**Notes:**

* Resets bidder contribution to 0
* Sends ETH back to caller
* Emits `RefundSent` event

---

### getTimeOver()

```solidity
function getTimeOver() public view returns (uint)
```

Returns the timestamp when the auction ends.

**Access:** Public

**Notes:**

* Useful for frontends to display remaining auction time

---

## Events

| Event                                        | Description                                         |
| -------------------------------------------- | --------------------------------------------------- |
| `NewHighestBid(address bidder, uint amount)` | Emitted when a new highest bid is placed            |
| `AuctionEnded(address winner, uint amount)`  | Emitted when auction ends                           |
| `RefundSent(address bidder, uint amount)`    | Emitted when a non-winning bidder receives a refund |

---

## Usage Example

### Deploying the Contract

```javascript
const Auction = await ethers.getContractFactory("Auction");
const auction = await Auction.deploy(
  ethers.parseEther("1"), // starting price
  86400 // auction length in seconds (1 day)
);
await auction.deployed();
```

---

### Placing a Bid

```javascript
await auction.connect(user1).placeBid({
  value: ethers.parseEther("2")
});
```

---

### Ending the Auction (Owner)

```javascript
// after auction time ends
await auction.endAuction();
```

---

### Claiming Refund (Non-Winning Bidder)

```javascript
await auction.connect(user2).refunds();
```

---

## Important Notes

1. **Owner Restrictions**: Owner cannot place bids.
2. **One-Time Actions**:

   * Auction can only be ended once
   * Refunds can only be claimed once per non-winning bidder
3. **ETH Transfer**: Uses `.call()` for safe Ether transfer.
4. **Timing**: Auction must expire before ending.

---

## Error Messages

| Message                                                     | Meaning                                  |
| ----------------------------------------------------------- | ---------------------------------------- |
| "owner cannot bid"                                          | Owner tried to place a bid               |
| "Auction has ended"                                         | Auction is no longer active              |
| "Bid must be higher than current highest bid , Bid too low" | Bid is too low                           |
| "Auction is already ended"                                  | Attempted to end auction twice           |
| "Bid is still active"                                       | Tried to end auction before time expired |
| "Not owner"                                                 | Non-owner attempted restricted action    |
| "Failed"                                                    | ETH transfer failed                      |
| "Winner cannot refund"                                      | Winner attempted to refund               |
| "No funds to withdraw"                                      | User has no bids to refund               |

---

## License

MIT

---

