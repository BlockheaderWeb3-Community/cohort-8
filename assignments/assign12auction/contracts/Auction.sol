// SPDX-License-Identifier:MIT
pragma solidity 0.8.28;

contract Auction {

    address public owner;
    uint256 public startingPrice;
    uint256 public endTime;

    address public highestBidder;
    uint256 public highestBid;

    bool public auctionEnded;

    // Track refundable balances
    mapping(address => uint256) public pendingReturns;

    // Events
    event BidPlaced(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor(uint256 _startingPrice, uint256 _duration) {
        owner = msg.sender;
        startingPrice = _startingPrice;
        endTime = block.timestamp + _duration;

        // initial highest bid is starting price
        highestBid = _startingPrice;
    }

    
        //Place a bid by sending ETH
    
    function bid() external payable {

        require(block.timestamp < endTime, "Auction ended");
        require(msg.sender != owner, "Owner cannot bid");
        require(msg.value > highestBid, "Bid too low");

        // Store previous highest bid for refund
        if (highestBidder != address(0)) {
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit BidPlaced(msg.sender, msg.value);
    }

    
       // Withdraw refundable ETH (for outbid users)
    
    function withdraw() external {

        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        // update state before transfer
        pendingReturns[msg.sender] = 0;

        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    
        //Owner ends the auction after time expires
    
    function endAuction() external {

        require(msg.sender == owner, "Not owner");
        require(block.timestamp >= endTime, "Auction still active");
        require(!auctionEnded, "Already ended");

        auctionEnded = true;

        // Transfer highest bid to owner
        if (highestBidder != address(1)) {
            payable(owner).transfer(highestBid);
        }

        emit AuctionEnded(highestBidder, highestBid);
    }
}

