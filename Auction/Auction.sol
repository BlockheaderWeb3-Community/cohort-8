// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract AuctionContract {
    uint public auctionCounter;
    
    enum AuctionStatus { Pending, OnGoing, Completed, Cancelled }
    
    struct Auction {
        uint id;
        uint startingPrice;
        AuctionStatus status;
        address owner;
        address highestBidder;
        uint startTime;
        uint duration;
        uint highestBid;
    }
    
    mapping(uint => Auction) public auctions;
    mapping(address => uint) public refunds;
    
    event AuctionInitialized(uint id);
    event AuctionStarted(uint id);
    event NewBid(uint id, address bidder, uint amount);
    event AuctionEnded(uint id, address winner, uint amount);
    event AuctionCancelled(uint id);
    event Refunded(address bidder, uint amount);
    
    function createAuction(uint _price, uint _duration) external returns(uint) {
        require(_price > 0, "zero price");
        require(_duration > 600, "min 10mins");
        
        auctionCounter++;
        auctions[auctionCounter] = Auction({
            id: auctionCounter,
            startingPrice: _price,
            status: AuctionStatus.Pending,
            owner: msg.sender,
            highestBidder: address(0),
            startTime: 0,
            duration: _duration,
            highestBid: 0
        });
        
        emit AuctionInitialized(auctionCounter);
        return auctionCounter;
    }
    
    function startAuction(uint _id) external {
        Auction storage a = auctions[_id];
        require(msg.sender == a.owner, "!owner");
        require(a.status == AuctionStatus.Pending, "!pending");
        
        a.status = AuctionStatus.OnGoing;
        a.startTime = block.timestamp;
        emit AuctionStarted(_id);
    }
    
    function bid(uint _id) external payable {
        Auction storage a = auctions[_id];
        require(a.status == AuctionStatus.OnGoing, "!active");
        require(block.timestamp < a.startTime + a.duration, "ended");
        require(msg.value > a.highestBid, "bid too low");
        require(msg.value >= a.startingPrice, "below min");
        require(msg.sender != a.owner, "owner cant bid");
        
        if (a.highestBidder != address(0)) {
            refunds[a.highestBidder] += a.highestBid;
        }
        
        a.highestBidder = msg.sender;
        a.highestBid = msg.value;
        
        emit NewBid(_id, msg.sender, msg.value);
    }
    
    function withdraw() external {
        uint amount = refunds[msg.sender];
        require(amount > 0, "no refund");
        
        refunds[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit Refunded(msg.sender, amount);
    }
    
    function endAuction(uint _id) external {
        Auction storage a = auctions[_id];
        require(msg.sender == a.owner, "!owner");
        require(a.status == AuctionStatus.OnGoing, "!ongoing");
        require(block.timestamp >= a.startTime + a.duration, "not ended");
        
        a.status = AuctionStatus.Completed;
        
        if (a.highestBid > 0) {
            payable(a.owner).transfer(a.highestBid);
        }
        
        emit AuctionEnded(_id, a.highestBidder, a.highestBid);
    }
    
    function cancelAuction(uint _id) external {
        Auction storage a = auctions[_id];
        require(msg.sender == a.owner, "!owner");
        require(a.status == AuctionStatus.Pending || a.status == AuctionStatus.OnGoing, "!cancellable");
        require(a.highestBidder == address(0), "has bids");
        
        a.status = AuctionStatus.Cancelled;
        emit AuctionCancelled(_id);
    }
    
    function getAuction(uint _id) external view returns (
        uint id,
        uint startingPrice,
        AuctionStatus status,
        address owner,
        address highestBidder,
        uint startTime,
        uint duration,
        uint highestBid,
        uint endTime,
        bool isActive
    ) {
        Auction memory a = auctions[_id];
        id = a.id;
        startingPrice = a.startingPrice;
        status = a.status;
        owner = a.owner;
        highestBidder = a.highestBidder;
        startTime = a.startTime;
        duration = a.duration;
        highestBid = a.highestBid;
        endTime = a.startTime + a.duration;
        isActive = (a.status == AuctionStatus.OnGoing && block.timestamp < endTime);
    }
    
    function getTimeLeft(uint _id) external view returns (uint) {
        Auction memory a = auctions[_id];
        if (a.status != AuctionStatus.OnGoing) return 0;
        uint end = a.startTime + a.duration;
        return block.timestamp >= end ? 0 : end - block.timestamp;
    }
}