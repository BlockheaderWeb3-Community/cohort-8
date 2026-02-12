// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleAuction {
    address public immutable owner;
    uint256 public immutable endTime;
    
    address public highestBidder;
    string public highestBidderName; 
    uint256 public highestBid;
    bool public auctionEnded;

    mapping(address => uint256) public refundlog;
    mapping(address => string) public addressToName;

    
    event HighestBidIncreased(address bidder, string name, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    constructor(uint256 _startingPrice, uint256 _durationSeconds) {
        owner = msg.sender;
        highestBid = _startingPrice; 
        endTime = block.timestamp + _durationSeconds;
    }

    /// Taking in bids by placing your name and the amount you are bidding 
    function bid(string memory _name, uint256 _bidAmount) external payable {
        
        // My Error handlers
        require(block.timestamp < endTime, "Auction already ended");
        require(msg.value >= _bidAmount, "Sent ETH must be higher than current highest bid");

        // My refund logic
        if (highestBidder != address(0)) {
            refundlog[highestBidder] += highestBid;
        }

        // How i update my highest bidder
        highestBidder = msg.sender;
        highestBidderName = _name;
        highestBid = msg.value;
        addressToName[msg.sender] = _name;

        emit HighestBidIncreased(msg.sender, _name, msg.value);
    }

    /// Withdrawal logic for Outbids
    function withdrawRefund() external returns (bool) {
        uint256 amount = refundlog[msg.sender];
        require(amount > 0, "No funds to withdraw");

        // Reset balance BEFORE the transfer (Security: Checks-Effects-Interactions)
        refundlog[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        return true;
    }

    /// HighestBidder claiming prize logic
    function endAuction() external {
        require(msg.sender == owner, "Only owner can end auction");
        require(block.timestamp >= endTime, "Auction not yet finished");
        require(!auctionEnded, "Auction end already called");

        auctionEnded = true;
        emit AuctionEnded(highestBidder, highestBid);

        // Paying the Higheest bid to the owner 
        (bool success, ) = payable(owner).call{value: highestBid}("");
        require(success, "Owner payout failed");
    }
}