// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Escrow {
    // State variables
    address public buyer;
    address public seller;
    address public escrowAgent;

    uint256 public escrowAmount;
    uint256 public immutable escrowFee; // Fee percentage (e.g., 100 = 1%)
    uint256 public immutable disputeTimeout; // Time before auto-release
    uint256 public depositTimestamp;

    bool public deliveryConfirmed;
    bool public disputed;

    enum EscrowState {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        REFUNDED,
        DISPUTED
    }

    EscrowState public escrowState;

    // Events for transparency
    event Deposited(address indexed buyer, uint256 amount, uint256 timestamp);
    event DeliveryConfirmed(address indexed seller, uint256 timestamp);
    event FundsReleased(address indexed seller, uint256 amount, uint256 fee);
    event RefundIssued(address indexed buyer, uint256 amount);
    event DisputeRaised(address indexed initiator, uint256 timestamp);
    event DisputeResolved(address indexed winner, uint256 amount);

    // Custom errors (gas efficient)
    error Unauthorized();
    error InvalidState();
    error InvalidAmount();
    error TransferFailed();
    error DisputeActive();
    error TimeoutNotReached();

    constructor(
        address _buyer,
        address _seller,
        uint256 _escrowFee, // in basis points (100 = 1%)
        uint256 _disputeTimeout // in seconds
    ) {
        require(_buyer != address(0) && _seller != address(0), "Invalid address");
        require(_buyer != _seller, "Buyer and seller must differ");
        require(_escrowFee <= 1000, "Fee too high"); // Max 10%

        buyer = _buyer;
        seller = _seller;
        escrowAgent = msg.sender;
        escrowFee = _escrowFee;
        disputeTimeout = _disputeTimeout;
        escrowState = EscrowState.AWAITING_PAYMENT;
    }

    // Modifiers
    modifier onlyEscrowAgent() {
        if (msg.sender != escrowAgent) revert Unauthorized();
        _;
    }

    modifier onlyBuyer() {
        if (msg.sender != buyer) revert Unauthorized();
        _;
    }

    modifier onlySeller() {
        if (msg.sender != seller) revert Unauthorized();
        _;
    }

    modifier inState(EscrowState _state) {
        if (escrowState != _state) revert InvalidState();
        _;
    }

    modifier noDispute() {
        if (disputed) revert DisputeActive();
        _;
    }

    /**
     * @notice Buyer deposits funds into escrow
     * @dev Only buyer can deposit, only once
     */
    function deposit() external payable onlyBuyer inState(EscrowState.AWAITING_PAYMENT) {
        if (msg.value == 0) revert InvalidAmount();

        escrowAmount = msg.value;
        depositTimestamp = block.timestamp;
        escrowState = EscrowState.AWAITING_DELIVERY;

        emit Deposited(buyer, msg.value, block.timestamp);
    }

    /**
     * @notice Seller confirms delivery of goods/services
     * @dev Sets flag that agent can use to release funds
     */
    function confirmDelivery() external onlySeller inState(EscrowState.AWAITING_DELIVERY) noDispute {
        deliveryConfirmed = true;
        emit DeliveryConfirmed(seller, block.timestamp);
    }

    /**
     * @notice Escrow agent releases funds to seller
     */
    function releaseFunds() external onlyEscrowAgent inState(EscrowState.AWAITING_DELIVERY) noDispute {
        require(deliveryConfirmed, "Delivery not confirmed");

        uint256 amount = escrowAmount;
        uint256 fee = (amount * escrowFee) / 10000;
        uint256 sellerAmount = amount - fee;

        escrowState = EscrowState.COMPLETE;
        escrowAmount = 0;

        (bool successSeller,) = payable(seller).call{value: sellerAmount}("");
        if (!successSeller) revert TransferFailed();

        if (fee > 0) {
            (bool successAgent,) = payable(escrowAgent).call{value: fee}("");
            if (!successAgent) revert TransferFailed();
        }

        emit FundsReleased(seller, sellerAmount, fee);
    }

    /**
     * @notice Escrow agent refunds buyer
     */
    function refundBuyer() external onlyEscrowAgent inState(EscrowState.AWAITING_DELIVERY) {
        uint256 amount = escrowAmount;

        escrowState = EscrowState.REFUNDED;
        escrowAmount = 0;

        (bool success,) = payable(buyer).call{value: amount}("");
        if (!success) revert TransferFailed();

        emit RefundIssued(buyer, amount);
    }

    /**
     * @notice Either party can raise a dispute
     * @dev Freezes the escrow until agent resolves
     */
    function raiseDispute() external inState(EscrowState.AWAITING_DELIVERY) {
        if (msg.sender != buyer && msg.sender != seller) revert Unauthorized();

        disputed = true;
        escrowState = EscrowState.DISPUTED;

        emit DisputeRaised(msg.sender, block.timestamp);
    }

    /**
     * @notice Escrow agent resolves dispute
     * @param favorBuyer true to refund buyer, false to pay seller
     */
    function resolveDispute(bool favorBuyer) external onlyEscrowAgent inState(EscrowState.DISPUTED) {
        uint256 amount = escrowAmount;
        address winner = favorBuyer ? buyer : seller;

        // Update state before external calls
        escrowState = favorBuyer ? EscrowState.REFUNDED : EscrowState.COMPLETE;
        escrowAmount = 0;
        disputed = false;

        uint256 fee = favorBuyer ? 0 : (amount * escrowFee) / 10000;
        uint256 payoutAmount = amount - fee;

        (bool success,) = payable(winner).call{value: payoutAmount}("");
        if (!success) revert TransferFailed();

        if (fee > 0) {
            (bool successFee,) = payable(escrowAgent).call{value: fee}("");
            if (!successFee) revert TransferFailed();
        }

        emit DisputeResolved(winner, payoutAmount);
    }

    /**
     * @notice Auto-release funds after timeout if no dispute
     * @dev Prevents indefinite lock of funds
     */
    function autoRelease() external inState(EscrowState.AWAITING_DELIVERY) noDispute {
        if (block.timestamp < depositTimestamp + disputeTimeout) {
            revert TimeoutNotReached();
        }

        uint256 amount = escrowAmount;
        uint256 fee = (amount * escrowFee) / 10000;
        uint256 sellerAmount = amount - fee;

        escrowState = EscrowState.COMPLETE;
        escrowAmount = 0;

        (bool successSeller,) = payable(seller).call{value: sellerAmount}("");
        if (!successSeller) revert TransferFailed();

        if (fee > 0) {
            (bool successAgent,) = payable(escrowAgent).call{value: fee}("");
            if (!successAgent) revert TransferFailed();
        }

        emit FundsReleased(seller, sellerAmount, fee);
    }

    /**
     * @notice Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Check if timeout has been reached
     */
    function isTimeoutReached() external view returns (bool) {
        if (escrowState != EscrowState.AWAITING_DELIVERY) return false;
        return block.timestamp >= depositTimestamp + disputeTimeout;
    }

    // Reject direct ETH transfers
    receive() external payable {
        revert("Use deposit() function");
    }
}
