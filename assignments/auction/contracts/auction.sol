// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract SimpleAuction {
    
    enum AuctionState { 
        Ongoing, 
        Ended 
        }

    AuctionState public state;

    struct Auction {
        address payable owner;
        uint startingPrice;
        uint endTime;
        address highestBidder;
        uint highestBid;
    }

    Auction public auction;

    mapping(address => uint) public pendingReturns;

    event BidPlaced(address indexed bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event RefundClaimed(address indexed bidder, uint amount);

    modifier onlyOwner() {
        require(msg.sender == auction.owner, "Only owner can call this");
        _;
    }

    constructor(uint _startingPrice, uint _durationInSeconds) {
        auction.owner = payable(msg.sender);
        auction.startingPrice = _startingPrice;
        auction.endTime = block.timestamp + _durationInSeconds;
        auction.highestBid = _startingPrice;
        state = AuctionState.Ongoing;
    }

    // Anyone can bid by sending ETH
    function bid() external payable {
    
        require(block.timestamp < auction.endTime, "Auction already ended");
        require(state == AuctionState.Ongoing, "Auction not ongoing");

        require(msg.sender != auction.owner, "Owner cannot bid");
        require(msg.value > auction.highestBid, "Bid too low");

        if (auction.highestBidder != address(0)) {
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit BidPlaced(msg.sender, msg.value);
    }

    // Outbid users must be able to withdraw their funds
    function withdrawRefund() external {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "Nothing to refund");

        pendingReturns[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");

        emit RefundClaimed(msg.sender, amount);
    }

    // Only owner can end the auction
    function endAuction() external onlyOwner {
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        require(state == AuctionState.Ongoing, "Already ended");

        state = AuctionState.Ended;

        if (auction.highestBidder != address(0)) {
            (bool success, ) = auction.owner.call{value: auction.highestBid}("");
            require(success, "Transfer to owner failed");
        }

        emit AuctionEnded(auction.highestBidder, auction.highestBid);
    }
}