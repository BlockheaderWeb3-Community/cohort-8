
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Escrow {

    enum State{
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE
    }


    State public currentState;

    address payable public buyer;
    address payable public seller;
    address public escrowAgent;

    uint public escrowAmount;

    bool public deliveryConfirmed;

    event PaymentDeposited(address indexed buyer, uint amount);
    event DeliveryConfirmed(address indexed seller);
    event FundsReleased(address indexed seller, uint amount);
    event FundsRefunded(address indexed buyer, uint amount);

     modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this function");
        _;
    }
    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this function");
        _;
    }
    modifier onlyEscrowAgent() {
        require(msg.sender == escrowAgent, "Only escrow agent can call this function");
        _;
    }
    
    modifier inState(State expectedState) {
        require(currentState == expectedState, "Invalid state for this operation");
        _;
    }
      
   constructor(address payable _seller, address _escrowAgent) {
        require(_seller != address(0), "Invalid seller address");
        require(_escrowAgent != address(0), "Invalid escrow agent address");
        require(_seller != _escrowAgent, "Seller and escrow agent must be different");
        
        seller = _seller;
        escrowAgent = _escrowAgent;
        currentState = State.AWAITING_PAYMENT;
        deliveryConfirmed = false;
    }

    function deposit() external payable inState(State.AWAITING_PAYMENT) {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        buyer = payable(msg.sender);
        escrowAmount = msg.value;
        currentState = State.AWAITING_DELIVERY;
        emit PaymentDeposited(buyer, msg.value);
    }

    function confirmDelivery() external onlyBuyer() inState(State.AWAITING_DELIVERY) {
        deliveryConfirmed = true;
        emit DeliveryConfirmed(seller);
    }
    
    function releaseFunds() external onlyEscrowAgent inState(State.AWAITING_DELIVERY) {
        require(address(this).balance >= escrowAmount, "Insufficient contract balance");
        currentState = State.COMPLETE;
        uint amountToRelease = escrowAmount;
        escrowAmount = 0;
       (bool success, ) = seller.call{value: amountToRelease}("");
        require(success, "transaction failed");
        emit FundsReleased(seller, amountToRelease);
    }

    function refund() external onlyEscrowAgent inState(State.AWAITING_DELIVERY) {
        require(address(this).balance >= escrowAmount, "Insufficient contract balance");
        uint amountToRefund = escrowAmount;
        require(currentState != State.COMPLETE, "already completed");
        currentState = State.AWAITING_PAYMENT;
        (bool success, ) = buyer.call{value: amountToRefund}("");
        require(success, "ETH refund failed");

        emit FundsRefunded(buyer, amountToRefund);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

     function getCurrentState() external view returns (string memory) {
        if (currentState == State.AWAITING_PAYMENT) {
            return "AWAITING_PAYMENT";
        } else if (currentState == State.AWAITING_DELIVERY) {
            return "AWAITING_DELIVERY";
        } else {
            return "COMPLETE";
        }
    }   

    function getContractDetails() external view returns (
        address _buyer,
        address _seller,
        address _escrowAgent,
        uint _escrowAmount,
        string memory _state,
        bool _deliveryConfirmed
    ) {
        return (
            buyer,
            seller,
            escrowAgent,
            escrowAmount,
            this.getCurrentState(),
            deliveryConfirmed
        );
    }


}


contract EscrowFactory {

    
    Escrow[] public escrows;

    event EscrowCreated(
        address indexed escrowAddress,
        address indexed seller
    );

    
    function createEscrow(address payable _seller)
        external
        returns (address)
    {
        Escrow escrow = new Escrow(_seller, address(this));
        escrows.push(escrow);

        emit EscrowCreated(address(escrow), _seller);
        return address(escrow);
    }

    function getEscrow(uint index) external view returns (address) {
        return address(escrows[index]);
    }

    function getAllEscrows() external view returns (address[] memory) {
        address[] memory list = new address[](escrows.length);

        for (uint i = 0; i < escrows.length; i++) {
            list[i] = address(escrows[i]);
        }

        return list;
    }

    function escrowsCount() external view returns (uint) {
        return escrows.length;
    }
}