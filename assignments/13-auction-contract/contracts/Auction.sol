// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract Auction {
  enum Status {
    START,
    END
  }

  struct AuctionItem {
    uint startingPrice;
    uint auctionDuration;
    address owner;
    Status phase;
  }

  mapping(address => AuctionItem) public auctions;

  struct User {
    uint amount;
    bool isRefunded;
    address userAddress;
  }

  mapping(address => User) public users;

  // Duration in seconds
  constructor(uint duration, uint _startingPrice) {
    auctions[msg.sender].auctionDuration = block.timestamp + duration;
    auctions[msg.sender].startingPrice = (_startingPrice * 1e18);
    auctions[msg.sender].owner = msg.sender;
    auctions[msg.sender].phase = Status.START;
  }

  function bidAmount(uint _amount, address _addr) public payable {
    uint formattedAmount = _amount * 1e18;
    require(
      formattedAmount > auctions[_addr].startingPrice,
      'Amount must be greater than previous bid'
    );
    require(msg.sender != auctions[msg.sender].owner, 'Only users can auction');
    require(
      block.timestamp > auctions[_addr].auctionDuration,
      'Auction has timed out'
    );
    auctions[_addr].startingPrice += formattedAmount;
    users[msg.sender].amount = formattedAmount;
    users[msg.sender].isRefunded = false;
    users[msg.sender].userAddress = msg.sender;
  }

  function stopAuction() public {
    require(msg.sender == auctions[msg.sender].owner, 'Only owners can stop');
    require(
      block.timestamp > auctions[msg.sender].auctionDuration,
      'Cant stop yet!'
    );
    auctions[msg.sender].phase = Status.END;
  }

  function refund(address _addr, uint _amount) public {
    User memory _user = users[msg.sender];
    require(
      block.timestamp > auctions[_addr].auctionDuration,
      'Cant withdraw yet!'
    );
    require(_user.isRefunded, 'Cant withdraw yet!');
    require(_user.amount == _amount, 'Not valid amount');
    (bool success, ) = msg.sender.call{value: _amount}('');
    require(success, 'Withdraw failed');
    users[msg.sender].isRefunded = true;
  }
}
