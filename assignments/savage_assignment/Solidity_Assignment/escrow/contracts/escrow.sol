// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EscrowSystem {

   // Define State 
   enum SystemStatus {
      AWAITING_DEPOSIT,
      ALREADY_DEPOSITED,
      ALREADY_DELIVERED,
      COMPLETED
   }

   struct Transactions {
      address buyer;
      address seller;
      uint amount;
      SystemStatus status;
      bool exists;
   }

   // Create Storage Sysytem: Building a system where each transaction  has a unique number, and the number let's you check your transaction in storage.  
   mapping (uint => Transactions) public txStorage;


   // Creating a counter: Tracking how many transactions gave been created so each gets a unique ID
   uint public txCounter;


   // This function creates a new transaction when ever it is called. 
   function newTransactions(address _buyer, address _seller, uint _amount) public  returns (uint) {
      txCounter++; // This creates new IDs for transactions
      txStorage[txCounter] = Transactions({ // Store new transactions at that ID
         buyer: _buyer,
         seller: _seller,
         amount: _amount,
         status: SystemStatus.AWAITING_DEPOSIT,
         exists: true

      });


      return txCounter;  // Return the ID that was used
   }


   // this function is recieves the payment from the buyer. 
   function deposit(uint _id) public payable {
      // this line is going into mapping/storage, to get a transaction and store it within storedTx.
      // This helps us to get every data within the transaction struct by using the variable storedTx. 
      Transactions storage storedTx = txStorage[_id];
      require(_id > 0 && _id <= txCounter, "Invalid ID");
      require(storedTx.exists, " Transaction doesn't exist");
      require(msg.sender == storedTx.buyer, "Only buyer can make deposit");
      require(msg.value == storedTx.amount, "Wrong amount sent");
      require(storedTx.status == SystemStatus.AWAITING_DEPOSIT, "Already Deposited");

      // changing status to already deposited. for the buyer has already sent the money. 
      storedTx.status = SystemStatus.ALREADY_DEPOSITED;
   }


   // this function is to confrim that the delievery has been made 
   function confirmDelivery(uint _id) public {
      Transactions storage storedTx = txStorage[_id];
      require(_id > 0 && _id <= txCounter, "Invalid ID");
      require(storedTx.exists, "Transaction doesn't exist");
      require(msg.sender == storedTx.buyer, "Only buyer can confirrm delivery");
      require(storedTx.status == SystemStatus.ALREADY_DEPOSITED, "Awaiting deposit");

      storedTx.status = SystemStatus.ALREADY_DELIVERED;
   }


   // 

   function releaseFunds(uint _id) public{
      Transactions storage storedTx = txStorage[_id];
      require(_id > 0 && _id <= txCounter, "Invalid ID");
      require(storedTx.exists, "Transaction doesn't exist");
      require(storedTx.status == SystemStatus.ALREADY_DELIVERED, "Awaiting delievery");
      require(msg.sender == storedTx.seller, "Only seller can receive payment");

      // Change state before sending money
      storedTx.status = SystemStatus.COMPLETED;

      // Seller recieves payment
      (bool success,) = storedTx.seller.call{value: storedTx.amount}("");
      require(success, "Transafer failed");

   }
}