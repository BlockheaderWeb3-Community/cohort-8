// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Auction {
    
    // --- STATE VARIABLES ---
    address payable public owner;
    uint256 public auctionEndTime;
    uint256 public highestBid;
    address public highestBidder;

    // Mapping to store refunds for outbid users
    // (Address => Amount they are owed)
    mapping(address => uint256) public pendingReturns;

    bool public ended;

    // --- EVENTS ---
    event HighestBidIncreased(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    // --- ERRORS (Gas efficient) ---
    error AuctionAlreadyEnded();
    error BidNotHighEnough(uint256 currentHighest);
    error AuctionNotYetEnded();
    error AuctionEndAlreadyCalled();

    // --- SETUP ---
    // Requirement: "Auction starts immediately on deployment"
    constructor(uint256 _biddingTime, uint256 _startingPrice) {
        owner = payable(msg.sender);
        auctionEndTime = block.timestamp + _biddingTime;
        highestBid = _startingPrice;
    }

    // --- 1. BIDDING ---
    // Requirement: "Previous highest bidder's ETH must be refundable"
    // Requirement: "No automatic refunds during bidding" (We use pendingReturns)
    function bid() external payable {
        if (block.timestamp > auctionEndTime) revert AuctionAlreadyEnded();
        if (msg.value <= highestBid) revert BidNotHighEnough(highestBid);

        // If there was a previous highest bidder, their bid is now refundable
        if (highestBidder != address(0)) {
            pendingReturns[highestBidder] += highestBid;
        }

        // Update state
        highestBidder = msg.sender;
        highestBid = msg.value;
        
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    // --- 2. WITHDRAW REFUNDS ---
    // Requirement: "Outbid users must be able to withdraw their funds"
    function withdraw() external returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // Important: Set to 0 before sending to prevent re-entrancy
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                // If send fails, restore the amount so they don't lose money
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    // --- 3. END AUCTION ---
    // Requirement: "Only owner can end the auction"
    // Requirement: "Owner receives the highest bid"
    function auctionEnd() external {
        if (msg.sender != owner) revert("Only owner can end");
        if (block.timestamp < auctionEndTime) revert AuctionNotYetEnded();
        if (ended) revert AuctionEndAlreadyCalled();

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // Transfer the winning bid to the owner
        
        uint256 balance = address(this).balance;
       
        if (highestBidder != address(0)) {
             (bool success, ) = owner.call{value: highestBid}("");
             require(success, "Transfer to owner failed");
        }
    }
}