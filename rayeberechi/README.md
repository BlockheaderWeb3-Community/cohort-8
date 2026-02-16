# Simple Auction Contract

A secure auction system using the **Withdrawal Pattern**.

## How it Works
1. **Deploy**: Owner sets `startingPrice` and `duration`. Auction starts immediately.
2. **Bid**: 
   - Users send ETH > current `highestBid`.
   - The *previous* highest bidder's money is moved to a `pendingReturns` mapping (not sent back automatically, for security).
3. **Withdraw**: 
   - If you are outbid, call `withdraw()` to retrieve your funds.
4. **End**: 
   - Once time expires, the Owner calls `auctionEnd()`.
   - The contract sends the winning bid amount to the Owner.

## Why "Withdraw" instead of "Refund"?
If we automatically refunded the previous bidder inside the `bid()` function, a malicious bidder could create a contract that *refuses* ETH. This would cause the refund to fail, meaning no one else could bid (Denial of Service). By making users pull their own funds, the auction can never be stuck.