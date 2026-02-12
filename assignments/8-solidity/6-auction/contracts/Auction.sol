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

    function bid(uint _auctionId) external payable {
        Auction storage auction = auctions[_auctionId];

        require(auction.id != 0, "Auction does not exist");
        require(auction.status == AuctionStatus.OnGoing, "Auction not active");
        require(block.timestamp <= auction.startTime + auction.duration, "Auction ended");
        require(msg.sender != auction.owner, "Owner cannot bid");
        require(msg.value > 0, "Bid must be greater than zero");

        uint currentBid = refunds[_auctionId][msg.sender] + msg.value;

        if (auction.highestBid == 0) {
            require(currentBid >= auction.startingPrice, "Below starting price");
        } else {
            require(currentBid > auction.highestBid, "Bid too low");
        }

        // Refund previous highest bidder
        if (auction.highestBidder != address(0) && auction.highestBidder != msg.sender) {
            refunds[_auctionId][auction.highestBidder] += auction.highestBid;
        }

        // Reset bidder's pending refund since it's now active bid
        refunds[_auctionId][msg.sender] = 0;

        auction.highestBid = currentBid;
        auction.highestBidder = msg.sender;
    }

    function endAuction(uint _auctionsId) public {
        Auction storage auction = auctions[_auctionsId];

        require(auction.status == AuctionStatus.OnGoing, "Auction not ended yet");
        require(block.timestamp >= auction.startTime + auction.duration, "Auction not ended yet");

        auction.status = AuctionStatus.Completed;

        // Transfer funds to owner
        if (auction.highestBid > 0) {
            (bool sent, ) = auction.owner.call{value: auction.highestBid}("");
            require(sent, "Failed to send Ether to owner");
        }
    }

    function withdraw(uint _auctionId) external {
        uint amount = refunds[_auctionId][msg.sender];
        require(amount > 0, "No funds to withdraw");

        refunds[_auctionId][msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Transfer failed");
    }

    function refundBidders(address person) external view returns(uint){
        return address(person).balance;
    }

}

