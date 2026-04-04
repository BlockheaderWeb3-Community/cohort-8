// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Auction {
    address public owner;
    uint public startingPrice;
    uint public auctionEndTime;
    bool started;

    address public highestBidder;
    uint public highestBid;

    bool public ended;

    mapping(address => uint) public pendingReturns;

    constructor(uint _startingPrice, uint _duration) {
        owner = msg.sender;
        startingPrice = _startingPrice;
        auctionEndTime = block.timestamp + _duration;
        started=true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier auctionActive() {
        require(block.timestamp < auctionEndTime, "Auction ended");
        _;
    }

    modifier auctionEnded() {
        require(block.timestamp >= auctionEndTime, "Auction still active");
        _;
    }

    function bid() external payable auctionActive {
        require(msg.sender != owner, "Owner cannot bid");
        require(msg.value >= startingPrice, "Bid below starting price");
        require(msg.value > highestBid, "Bid not high enough");
        require(started == true, "bid is no longer active" );

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function endAuction() external onlyOwner auctionEnded {
        require(!ended, "Auction already ended");
        ended = true;
    }

    function withdraw() external {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        
        pendingReturns[msg.sender] = 0;

    
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function ownerWithdraw() external onlyOwner {
        require(ended, "Auction not ended");
        require(highestBid > 0, "No bids");

        uint amount = highestBid;
        highestBid = 0;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Owner withdrawal failed");
    }
}
