// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract CounterV3 {
    uint256 public number;
    address public owner;

    mapping(address => bool) public approvedCallers;
    mapping(address => bool) public pendingApproval;

    event ApprovalRequested(address indexed caller);
    event ApprovalGranted(address indexed caller);
    event ApprovalRevoked(address indexed caller);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != owner) {
            require(approvedCallers[msg.sender], "Owner consent required");
        }
        _;
    }

    function requestPrivilege() external {
        require(msg.sender != owner, "Owner does not need consent");

        pendingApproval[msg.sender] = true;
        emit ApprovalRequested(msg.sender);
    }

    function grantPrivilege(address caller) external onlyOwner {
        require(pendingApproval[caller], "No pending request");

        approvedCallers[caller] = true;
        pendingApproval[caller] = false;
        emit ApprovalGranted(caller);
    }

    function revokePrivilege(address caller) external onlyOwner {
        require(approvedCallers[caller], "Caller not approved");

        approvedCallers[caller] = false;
        emit ApprovalRevoked(caller);
    }

    function setNumber(uint256 newNumber) public onlyAuthorized {
        number = newNumber;
    }

    function increment() public onlyAuthorized {
        number++;
    }
}
