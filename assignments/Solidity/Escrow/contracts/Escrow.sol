// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FactoryEscrow {

    enum Status { 
        Invalid,
        Pending, 
        Funded, 
        Completed, 
        Refunded 
        }

    struct Order {
        address buyer;
        address seller;
        uint256 amount;
        Status status;
    }

    // Mapping from Order ID to Order details
    mapping(uint256 => Order) public orders;

    uint256 public orderCount;


    //  An order is Created, specifying the seller addr and the price.
    function createOrder(address _seller, uint256 _amount) external returns (uint256) {
        require(_seller != address(0), "Invalid seller address");
        require(_amount > 0, "Amount must be greater than zero");

        orderCount++;
        orders[orderCount] = Order({
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            status: Status.Pending
        });

        return orderCount;
    }

    
    //  Buyer pays the required amount into the contract for a specific order.
    
    function fundOrder(uint256 _orderId) external payable {
        Order storage order = orders[_orderId];
        
        require(msg.sender == order.buyer, "Only the buyer can fund this order");
        require(msg.value == order.amount, "Incorrect ETH amount sent");
        require(order.status == Status.Pending, "Order is not in Pending state");

        order.status = Status.Funded;
    }

    //  Buyer confirms receipt and releases money to the seller.
    
    function redeemOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];

        require(msg.sender == order.buyer, "Only the buyer can release funds");
        require(order.status == Status.Funded, "Funds must be deposited first");

        order.status = Status.Completed;
        
        (bool success, ) = payable(order.seller).call{value: order.amount}("");
        require(success, "Transfer to seller failed");

    }

    //Seller cancels the deal and sends the money back to the buyer
    function refundOrder(uint256 _orderId) external {
    Order storage order = orders[_orderId];

    // In this Case Only the Seller can initiate a refund
    require(msg.sender == order.seller, "Only the seller can authorize a refund");

    // There must be money in the contract to refund
    require(order.status == Status.Funded, "Order is not funded");

    // Change to Refunded BEFORE sending money (prevents double-spending)
    order.status = Status.Refunded;

    // Sending the money back to the buyer
    (bool success, ) = payable(order.buyer).call{value: order.amount}("");
    require(success, "Refund transfer failed");

}

    // Just to check the staus of a specific order
    function getStatus(uint256 _orderId) external view returns (Status) {
        return orders[_orderId].status;
    }
}