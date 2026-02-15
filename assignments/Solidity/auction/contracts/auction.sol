// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract AuctionContract {

uint public auctionCounter;

    enum AuctionStatus{
        Pending,
        OnGoing,
        Completed,
        Cancelled
    }

    struct Auction{
        uint id;
        uint startingPrice;
        AuctionStatus status;
        address owner;
        address highestBidder;
        uint highestBid;
        uint startTime;
        uint duration;

    }

    mapping (uint => Auction) public auctions;
    mapping(uint => mapping(address => uint)) public refunds;

    event AuctionInitialaized(uint id);

    constructor() {
        
    }

 function createAuction(uint _price, uint _duration) public returns(uint){
    require(_price > 0, 'non zero price');
    require(_duration > 600, 'minimum 10mins for auction time');

    auctionCounter++;
    Auction memory a =  Auction(auctionCounter, _price, AuctionStatus.Pending, msg.sender, address(0), 0, 0, _duration);

    auctions[auctionCounter] = a;
    emit AuctionInitialaized(auctionCounter);

    return auctionCounter;
}

function startAuction(uint _auctionsId) public {
    Auction storage a =  auctions[_auctionsId];

    require(msg.sender == a.owner, "Not your Auction");
    require(a.status == AuctionStatus.Pending, 'invalid auction Status');

    a.status = AuctionStatus.OnGoing;
    a.startTime = block.timestamp;
}



function bid(uint auction_id) external payable returns(bool){
    Auction storage auction = auctions[auction_id];
    require(msg.sender != auction.owner, "You can't bid on your own auction");
    require(msg.value > 0, "Send Eth greater than zero");
    require(auction.status == AuctionStatus.OnGoing, "Invalid Status");

    uint totalBid = refunds[auction_id][msg.sender] + msg.value;
    require(totalBid > auction.highestBid, "Bid must be higher than current highesst bid");

    // refunds[auction_id][msg.sender] = 0;

    if (auction.highestBidder != address(0)) {
        refunds[auction_id][auction.highestBidder] += auction.highestBid;
    }

    auction.highestBid = totalBid;
    auction.highestBidder = msg.sender;

}


  function endAuction(uint _auctionId) external {
        Auction storage auction = auctions[_auctionId];

        require(auction.status == AuctionStatus.OnGoing, "Auction not ongoing");
        require(
            block.timestamp >= auction.startTime + auction.duration,
            "Auction not ended yet"
        );

        auction.status = AuctionStatus.Completed;

        // If no bids, nothing else to do
        if (auction.highestBidder == address(0)) {
            return;
        }

        // Transfer highest bid to auction owner
        (bool success, ) = auction.owner.call{value: auction.highestBid}("");
        require(success, "Bid transfer failed");
    }

    function refundBidders(uint _auctionId) external {
        uint amount = refunds[_auctionId][msg.sender];
        require(amount > 0, "No refund available");

        refunds[_auctionId][msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Bid transfer failed");
    }

    function refundsGetterFunction(uint _id, address addr) public view{
        refunds[_id][addr];
    }

}