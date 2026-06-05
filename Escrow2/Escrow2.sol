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

    struct BidInfo {
        address bidder;
        uint amount;
    }
    
    mapping(address => uint) public pendingReturns;
    mapping(uint => BidInfo[]) public auctionBids;
    mapping(uint => Auction) public auctions;

    event AuctionInitialized(uint id);
    event AuctionStarted(uint indexed auctionId, uint startTime);
    event NewBid(uint indexed auctionId, address indexed bidder, uint amount);
    event AuctionEnded(uint indexed auctionId, address indexed winner, uint amount);
    event RefundWithdrawn(address indexed bidder, uint amount);
    event AuctionCancelled(uint indexed auctionId);

    function createAuction(uint _price, uint _duration) external returns(uint) {
        require(_price > 0, 'non zero price');
        require(_duration > 600, 'minimum 10mins');
        
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

    function startAuction(uint _auctionId) external {
        Auction storage a = auctions[_auctionId];
        require(msg.sender == a.owner, "Not your Auction");
        require(a.status == AuctionStatus.Pending, 'invalid Status');
        
        a.status = AuctionStatus.OnGoing;
        a.startTime = block.timestamp;
        emit AuctionStarted(_auctionId, block.timestamp);
    }

    function bid(uint auctionId) external payable {
        Auction storage a = auctions[auctionId];
        
        require(a.status == AuctionStatus.OnGoing, "Not active");
        require(block.timestamp < a.startTime + a.duration, "Ended");
        require(msg.value > a.highestBid, "Bid too low");
        require(msg.value >= a.startingPrice, "Below starting price");
        require(msg.sender != a.owner, "Owner cannot bid");
        
        if (a.highestBidder != address(0)) {
            pendingReturns[a.highestBidder] += a.highestBid;
        }
        
        a.highestBidder = msg.sender;
        a.highestBid = msg.value;
        auctionBids[auctionId].push(BidInfo(msg.sender, msg.value));
        
        emit NewBid(auctionId, msg.sender, msg.value);
    }
    
    function endAuction(uint auctionId) external {
        Auction storage a = auctions[auctionId];
        
        require(a.status == AuctionStatus.OnGoing, "Not active");
        require(msg.sender == a.owner, "Only owner");
        require(block.timestamp >= a.startTime + a.duration, "Not ended");
        
        a.status = AuctionStatus.Completed;
        
        if (a.highestBid > 0) {
            payable(a.owner).transfer(a.highestBid);
        }
        
        emit AuctionEnded(auctionId, a.highestBidder, a.highestBid);
    }
    
    function cancelAuction(uint auctionId) external {
        Auction storage a = auctions[auctionId];
        
        require(msg.sender == a.owner, "Only owner");
        require(a.status == AuctionStatus.Pending || a.status == AuctionStatus.OnGoing, "Invalid");
        require(a.highestBidder == address(0), "Has bids");
        
        a.status = AuctionStatus.Cancelled;
        emit AuctionCancelled(auctionId);
    }
    
    function withdrawRefund() external {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No refund");
        
        pendingReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit RefundWithdrawn(msg.sender, amount);
    }
    
    function getAuction(uint auctionId) external view returns (
        uint id, uint startingPrice, AuctionStatus status, address owner,
        address highestBidder, uint startTime, uint duration, uint highestBid,
        uint endTime, bool isActive
    ) {
        Auction memory a = auctions[auctionId];
        endTime = a.startTime + a.duration;
        isActive = (a.status == AuctionStatus.OnGoing && block.timestamp < endTime);
        return (a.id, a.startingPrice, a.status, a.owner, a.highestBidder, 
                a.startTime, a.duration, a.highestBid, endTime, isActive);
    }
    
    function getAuctionBids(uint auctionId) external view returns (BidInfo[] memory) {
        return auctionBids[auctionId];
    }
    
    function getAuctionCount() external view returns (uint) {
        return auctionCounter;
    }
    
    function getTimeLeft(uint auctionId) external view returns (uint) {
        Auction memory a = auctions[auctionId];
        if (a.status != AuctionStatus.OnGoing || block.timestamp >= a.startTime + a.duration) {
            return 0;
        }
        return (a.startTime + a.duration) - block.timestamp;
    }
    
    function isAuctionActive(uint auctionId) external view returns (bool) {
        Auction memory a = auctions[auctionId];
        return a.status == AuctionStatus.OnGoing && block.timestamp < a.startTime + a.duration;
    }
    
    receive() external payable {}
}