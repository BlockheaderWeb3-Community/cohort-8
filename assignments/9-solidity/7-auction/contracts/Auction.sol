// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

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
        uint highestBid;
        address highestBidder;
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
        Auction memory a =  Auction(auctionCounter, _price, AuctionStatus.Pending, msg.sender, 0, address(0), 0, _duration);

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

    function bid(uint _auctionsId) public payable {
        Auction storage auction = auctions[_auctionsId];
        require(msg.sender != auction.owner, "You can't bid on your own auction");
        require(msg.value > 0, "Send Eth greater than zero");
        require(auction.status == AuctionStatus.OnGoing, "invalid Status");

        uint totalBid = refunds[_auctionsId][msg.sender] += msg.value;
        require(totalBid > auction.highestBid, "Bid must be higher than the current bidder");

        // Clear pending returns for this bidder since we're using it
        refunds[_auctionsId][msg.sender] = 0;

        // Refunds the previous highest bidderj
        if (auction.highestBidder != address(0) && auction.highestBidder != auction.owner) {
            refunds[_auctionsId][auction.highestBidder] += auction.highestBid;
        }

        // Update highest bid
        auction.highestBid = totalBid;
        auction.highestBidder = msg.sender;
    }

    // function withdraw(uint _auctionsId) payable public {
    //     Auction storage auction = auctions[_auctionsId];
    //     require(msg.sender != auction.owner, "You can't bid on your own auction");
    //     require(msg.value > 0, "Send Eth greater than zero");
    //     require(auction.status == AuctionStatus.OnGoing, "invalid Status");

    //     uint totalBid = refunds[_auctionsId][msg.sender] += msg.value;
    //     require(totalBid > auction.highestBid, "Bid must be higher than the current bidder");

    //     // Clear pending returns for this bidder since we're using it
    //     refunds[_auctionsId][msg.sender] = 0;

    //     // Refunds the previous highest bidder
    //     if (auction.highestBidder != address(0) && auction.highestBidder != auction.owner) {
    //         refunds[_auctionsId][auction.highestBidder] += auction.highestBid;
    //     }

    //     // Update highest bid
    //     auction.highestBid = totalBid;
    //     auction.highestBidder = msg.sender;
    // }

    function returnBalances(address person) external view returns(uint){
        uint bal = address(person).balance;

        return bal;
    }

}

