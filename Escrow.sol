 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleMarketplace {

    struct Buyer {
        address wallet;
        uint totalSpent;
    }
    
    struct Seller {
        address wallet;
        uint totalEarned;
        string shopName;
    }
    
    struct Transaction {
        address buyer;
        address seller;
        uint amount;
        bool isCompleted;
    }
    
    
    mapping(address => Buyer) public buyers;
    mapping(address => Seller) public sellers;
    Transaction[] public transactions;
    
    event TransactionCreated(uint id, address buyer, address seller, uint amount);
    event TransactionCompleted(uint256 id);
    
    
    function registerAsBuyer() public {
        buyers[msg.sender] = Buyer(msg.sender, 0);
    }
    
    function registerAsSeller(string memory _shopName) public {
        sellers[msg.sender] = Seller(msg.sender, 0, _shopName);
    }
    
    function createTransaction(address _seller) public payable {
        require(msg.value > 0, "Value must be greater than 0");
        
        uint id = transactions.length;
        transactions.push(Transaction({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            isCompleted: false
        }));
        
    
        buyers[msg.sender].totalSpent += msg.value;
        
        emit TransactionCreated(id, msg.sender, _seller, msg.value);
    }
    
    
    function completeTransaction(uint256 _id) public {
        Transaction storage txn = transactions[_id];
        
        
        require(msg.sender == txn.seller, "Not seller");
        require(!txn.isCompleted, "Already completed");
        
    
        txn.isCompleted = true;
        
        
        payable(txn.seller).transfer(txn.amount);
        
        
        sellers[txn.seller].totalEarned += txn.amount;
        
        emit TransactionCompleted(_id);
    }
    
    
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
}

