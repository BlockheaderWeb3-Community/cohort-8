// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract AuctionContract {
    uint public auctionCounter;

    enum AuctionStatus {
        Pending,
        OnGoing,
        Completed,
        Cancelled
    }

    struct Auction {
        uint id;
        uint startingPrice;
        uint highestBid;
        AuctionStatus status;
        address owner;
        address highestBidder;
        uint startTime;
        uint duration;
    }

    mapping(uint => Auction) public auctions;
    mapping(uint => mapping(address => uint)) public bidRecords;

    event AuctionInitialaized(uint id);
    event BidMade(address bidder, uint value, uint id);
    event AuctionEnded(uint id);

    constructor() {}

    function createAuction(uint _price, uint _duration) public returns (uint) {
        require(_price > 0, "Non zero price required");
        require(_duration > 600, "Minimum 10 mins");

        auctionCounter++;

        auctions[auctionCounter] = Auction({
            id: auctionCounter,
            startingPrice: _price,
            highestBid: _price,
            status: AuctionStatus.Pending,
            owner: msg.sender,
            highestBidder: address(0),
            startTime: 0,
            duration: _duration
        });

        emit AuctionInitialaized(auctionCounter);
        return auctionCounter;
    }

    function startAuction(uint _auctionId) public {
        Auction storage a = auctions[_auctionId];

        require(msg.sender == a.owner, "Not your Auction");
        require(a.status == AuctionStatus.Pending, "Invalid status");

        a.status = AuctionStatus.OnGoing;
        a.startTime = block.timestamp;
    }

    function bids(uint _auctionId) external payable {
        Auction storage a = auctions[_auctionId];

        require(a.status == AuctionStatus.OnGoing, "Auction not ongoing");
        require(block.timestamp < a.startTime + a.duration, "Auction ended");
        require(msg.sender != a.owner, "Owner should not bid");
        require(msg.value > 0, "Value should be greater than 0");
        require(msg.value > a.highestBid, "Not highest bid");

        bidRecords[_auctionId][msg.sender] += msg.value;

        a.highestBid = msg.value;
        a.highestBidder = msg.sender;

        emit BidMade(msg.sender, msg.value, _auctionId);
    }

    function refund(uint _auctionId) external {
        uint amount = bidRecords[_auctionId][msg.sender];
        require(amount > 0, "No funds to withdraw");

        bidRecords[_auctionId][msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function end(uint _auctionId) external {
        Auction storage a = auctions[_auctionId];

        require(msg.sender == a.owner, "Not owner");
        require(a.status == AuctionStatus.OnGoing, "Invalid status");
        require(block.timestamp >= a.startTime + a.duration, "Auction not ended");

        a.status = AuctionStatus.Completed;

        if (a.highestBid > 0) {
            (bool success, ) = a.owner.call{value: a.highestBid}("");
            require(success, "Transfer failed");
        }

        a.highestBid = 0;

        emit AuctionEnded(_auctionId);
    }
}