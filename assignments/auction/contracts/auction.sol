// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract auction {


    address user;
    address owner;
    uint startingPriceEth;
    uint auctionDuration;



    event bidPricePlaced(address user, uint startingPriceEth);
    event bidPriceEnded(address user, uint endingPriceEth);


    
    error notUser();
    error InvalidBidPrice();
    error withdrawFailed();
    error InvalidAmount();



    

   function bid(address _user, uint _startingPriceEth) external payable {
    if(msg.sender != _user) revert notUser();
    if(msg.value != _startingPriceEth) revert InvalidBidPrice();

    startingPriceEth = _startingPriceEth;
    user = _user;


    emit bidPricePlaced(user, startingPriceEth);
   }

   function endBid(uint _endingPriceEth) external {
    if(_endingPriceEth < startingPriceEth) revert InvalidBidPrice();
      
      uint256 endingprice = _endingPriceEth;
      _endingPriceEth = 0;

      (bool success,) = user.call{value: endingprice}("");
      if(!success) revert withdrawFailed();
   
       emit bidPriceEnded(user, endingprice);

   }

   function getRefund(uint _amount) external {
    if(msg.sender != user) revert notUser();
    if(_amount > startingPriceEth) revert InvalidAmount();

    uint256 refundAmont = _amount;
    _amount = 0;

        startingPriceEth -= refundAmont;
    
    (bool success,) = user.call{value: refundAmont}("");
    if(!success) revert withdrawFailed();

    emit bidPriceEnded(user, refundAmont);


   }


}