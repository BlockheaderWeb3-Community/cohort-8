// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {
    enum Status { PENDING, PAID, DONE }

    address public buyer;
    address payable public seller;
    Status public status;

    event Deposit(address indexed buyer, uint256 amount);
    event ConfirmReceipt(address indexed buyer, uint256 amountReleased);

    constructor(address _buyer, address payable _seller) {
        require(_buyer != address(0), "Invalid buyer");
        require(_seller != address(0), "Invalid seller");

        buyer = _buyer;
        seller = _seller;
        status = Status.PENDING; 
    }

    function deposit() external payable {
        require(msg.sender == buyer, "Only buyer can pay");
        require(status == Status.PENDING, "Already paid or done");
        require(msg.value > 0, "Must send ETH");

        status = Status.PAID;
        emit Deposit(msg.sender, msg.value);
    }

    function confirmReceipt() external {
        require(msg.sender == buyer, "Only buyer can confirm");
        require(status == Status.PAID, "Funds not deposited yet");

        status = Status.DONE;
        uint256 balance = address(this).balance;

        // Transfer funds to seller
        (bool success, ) = seller.call{value: balance}("");
        require(success, "Transfer failed");

        emit ConfirmReceipt(buyer, balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract EscrowFactory {

    Escrow[] public allOrders;

    event OrderCreated(address indexed newEscrowContract, address indexed buyer, address indexed seller);

    function createOrder(address payable _seller) external {
        require(_seller != address(0), "Invalid seller address");
        require(_seller != msg.sender, "You cannot buy from yourself");

        // Create new Escrow contract
        Escrow newEscrow = new Escrow(msg.sender, _seller);

        allOrders.push(newEscrow);

        emit OrderCreated(address(newEscrow), msg.sender, _seller);
    }

    function getAllOrders() external view returns (Escrow[] memory) {
        return allOrders;
    }
}