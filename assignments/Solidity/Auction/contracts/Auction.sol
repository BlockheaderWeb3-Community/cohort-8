// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Auction {
    address public owner;
    uint public highestBid;
    address public highestBidder;
    bool public isActive;
    uint timeOver;

    mapping(address => uint) public bids;

    event RefundSent(address bidder, uint amount);
    event NewHighestBid(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    constructor(uint _startingPrice, uint _auctionLength) {
        owner = msg.sender;
        require(_startingPrice > 0, "Must be greater than 0");
        require(_auctionLength > 0, "Must be greater than 0");
        require(msg.sender == owner, "Not owner");
        isActive = true; // ending auction twice
        highestBid = _startingPrice;
        timeOver = _auctionLength + block.timestamp;
    }

    function placeBid() public payable {

        require(msg.sender != owner, "owner cannot bid");
        require(isActive, "Auction has ended");
        require(
            msg.value > highestBid,
            "Bid must be higher than current highest bid , Bid too low"
        );
        require(block.timestamp < timeOver, "Auction time is over");
        bids[msg.sender] += msg.value;
        highestBid = msg.value;
        highestBidder = msg.sender;
        emit NewHighestBid(msg.sender, msg.value);
    }

    function endAuction() public {
        require(isActive, "Auction is already ended");
        require(block.timestamp >= timeOver, "Bid is still active");
        require(msg.sender == owner, "Not owner");
        isActive = false;
        emit AuctionEnded(highestBidder, highestBid);
        if (highestBid > 0) {
            (bool success, ) = payable(msg.sender).call{value: highestBid}("");
            require(success, "Failed");
        }
    }

    function refunds() public {
        require(msg.sender != highestBidder, "Winner cannot refund");
        require(!isActive, "Auction is still active");
        uint amount = bids[msg.sender];
        require(amount > 0, "No funds to withdraw");
        bids[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}(""); 
        require(success, "Failed");
        emit RefundSent(msg.sender, amount);
    }
    function getTimeOver() public view returns (uint) {
        return timeOver;
    }
}
