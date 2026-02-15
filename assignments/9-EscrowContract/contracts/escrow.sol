// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {

    uint public businessCounter;

    enum Status {
        NOT_PAID,
        PAID,
        DONE
    }

    struct Business {
        uint id;
        address buyer;
        address seller;
        uint amount;
        Status status;
        bool itemDelivered;
        bool itemReceived;
    }

    mapping(uint => Business) public businesses;

    event BusinessCreated(uint id, address buyer, address seller, uint amount);
    event PaymentMade(uint id);
    event Sent(uint id);

    function createBusiness(address _seller, uint _amount) external returns (uint) {
        require(_seller != address(0), "Invalid seller");
        require(_amount > 0, "Invalid amount");

        businessCounter++;

        businesses[businessCounter] = Business({
            id: businessCounter,
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            status: Status.NOT_PAID,
            itemDelivered: false,
            itemReceived: false
        });

        emit BusinessCreated(businessCounter, msg.sender, _seller, _amount);
        return businessCounter;
    }

    function pay(uint _id) external payable {
        Business storage b = businesses[_id];
        require(msg.sender == b.buyer, "Only buyer pays");
        require(b.status == Status.NOT_PAID, "Already paid");
        require(msg.value == b.amount, "Incorrect amount");

        b.status = Status.PAID;
        emit PaymentMade(_id);
    }


    function delivered(uint _id) external {
        Business storage b = businesses[_id];
        require(msg.sender == b.seller, "Only seller can call this function");
        b.itemDelivered = true;
    }

    function received(uint _id) external{
        Business storage b = businesses[_id];
        require(msg.sender == b.buyer, "Only buyer can call this function");
        b.itemReceived = true;
        send(_id);
    }

    function send(uint _id) private {
        Business storage b = businesses[_id];
        require(b.status == Status.PAID, "Payment not made");

        b.status = Status.DONE;

        (bool success,) = b.seller.call{value: b.amount}("");
        require(success, "Transfer failed");

        emit Sent(_id);
    }
}