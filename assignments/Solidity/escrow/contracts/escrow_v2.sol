// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Escrow {
    address buyer;
    address seller;
    address escrow;
    bool hasDeposited;
    bool haveSentGoods;
    mapping(address => uint) balances;
    mapping(address => Buyer) public buyerStatMapping;
    mapping(address => Seller) sellerStatMapping;

    mapping(address => uint) public buyerInitialAccount;
    mapping(address => uint) public locktime;

    struct Buyer{
        BuyerStatus status;
    }

    struct Seller{
        SellerStatus status;
    }

    enum BuyerStatus{
        AWAITING_DELIVERY,
        COMPLETE
    }

    enum SellerStatus{
        AWAITING_PAYMENT,
        COMPLETE
    }

    constructor(address _seller, address _buyer)   {
        buyer = _buyer; //  0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        seller = _seller; //  0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
        escrow = msg.sender;
        balances[_buyer] = 0;
    }

    function deposit() public payable  {
        require((msg.sender == buyer), "Only buyer should deposit");
        require(msg.value > 0, "ETH must be above 0");

        buyerInitialAccount[msg.sender] = msg.sender.balance;
        balances[buyer] += msg.value;
        buyerInitialAccount[msg.sender] -= msg.value;

        Buyer memory buyerInstance = buyerStatMapping[msg.sender];

        buyerInstance.status = BuyerStatus.AWAITING_DELIVERY;
        buyerStatMapping[msg.sender] = buyerInstance;

        hasDeposited = true;
        locktime[msg.sender] = block.timestamp + 15;
    }

    function deliverGoods() public  {
        require(msg.sender == seller, "Seller must call function");
        require(hasDeposited == true, "Buyer hasn't deposited");

        Seller memory sellerInstance = sellerStatMapping[msg.sender];

        sellerInstance.status = SellerStatus.AWAITING_PAYMENT;
        sellerStatMapping[msg.sender] = sellerInstance;
        
        haveSentGoods = true;
    }

    function receivedGoods() public {
        require(msg.sender == buyer, "Buyer must call function");
        require(haveSentGoods == true, "Goods not sent");
        Buyer memory buyerInstance = buyerStatMapping[msg.sender];

        buyerInstance.status = BuyerStatus.COMPLETE;
        buyerStatMapping[msg.sender] = buyerInstance;
    }

    function releaseFunds() public {
        require(msg.sender == escrow, "Escrow must call function");
        require(address(this).balance == balances[buyer], "Insuffiecient fund");

        Buyer storage buyerInstance = buyerStatMapping[buyer];
        require(buyerInstance.status == BuyerStatus.COMPLETE, "Buyer hasn't received delivery");

        uint amount = balances[buyer];
        (bool success,) = seller.call{value: amount}(" ");
        require(success, "Transaction failed");

        Seller memory sellerInstance = sellerStatMapping[seller];

        sellerInstance.status = SellerStatus.COMPLETE;
        sellerStatMapping[msg.sender] = sellerInstance;   
        
    }

    function refundBuyer() public {
        require(msg.sender == address(this), "Contract must call function");
        require(block.timestamp >= locktime[buyer], "Time's not up");
        // Buyer storage buyerInstance = buyerStatMapping[buyer];
        // Seller storage sellerInstance = sellerStatMapping[seller];
        // require((buyerInstance.status == sellerInstance.status), "Already acknowledged");
        uint amount =  address(this).balance;
        (bool success,) = seller.call{value: amount}(" ");
        require(success, "transcation failed");

    }
}


contract EscrowFactory {
    uint public identifier;

    function createEscrow(address _seller, address _buyer) external returns(address) {
        Escrow escrowInstance = new Escrow(_seller, _buyer);

        // escrowInstance()

        identifier++;

        return address(escrowInstance);
    }
}
