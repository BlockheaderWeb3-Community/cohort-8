// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract SimpleAuction {
  bool private locked;

  modifier nonReentrant() {
    require(!locked, "Reentrancy");
    locked = true;
    _;
    locked = false;
  }
  address public owner;
  uint256 public startingPrice;
  uint256 public endTime;
  bool public ended;

  address public highestBidder;
  uint256 public highestBid;

  mapping(address => uint256) public pendingReturns;

  event BidPlaced(address indexed bidder, uint256 amount);
  event AuctionEnded(address winner, uint256 amount);
  event RefundWithdrawn(address indexed bidder, uint256 amount);

  constructor(uint256 _startingPrice, uint256 _auctionDuration) {
    require(_startingPrice > 0, "Starting price must be > 0");
    require(_auctionDuration > 0, "Duration must be > 0");
    owner = msg.sender;
    startingPrice = _startingPrice;
    endTime = block.timestamp + _auctionDuration;
    highestBid = _startingPrice;
  }

  function bid() public payable {
    require(block.timestamp < endTime, "Auction ended");
    require(!ended, "Auction already ended");
    require(msg.sender != owner, "Owner cannot bid");
    require(msg.value > highestBid, "Bid too low");

    if (highestBidder != address(0)) {
      pendingReturns[highestBidder] += highestBid;
    }

    highestBidder = msg.sender;
    highestBid = msg.value;
    emit BidPlaced(msg.sender, msg.value);
  }

  function withdrawRefund() external nonReentrant {
    uint256 amount = pendingReturns[msg.sender];
    require(amount > 0, "No refund");
    pendingReturns[msg.sender] = 0;
    (bool ok, ) = payable(msg.sender).call{value: amount}("");
    require(ok, "Refund failed");
    emit RefundWithdrawn(msg.sender, amount);
  }

  function endAuction() external nonReentrant {
    require(msg.sender == owner, "Only owner");
    require(block.timestamp >= endTime, "Auction not ended");
    require(!ended, "Already ended");
    ended = true;
    if (highestBidder != address(0)) {
      (bool ok, ) = payable(owner).call{value: highestBid}("");
      require(ok, "Payout failed");
    }
    emit AuctionEnded(highestBidder, highestBidder == address(0) ? 0 : highestBid);
  }

  receive() external payable {
    bid();
  }
}
