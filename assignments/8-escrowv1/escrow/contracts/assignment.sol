// SPDX License-Identifier: MIT
pragma solidity 0.8.28;

contract payment {
    enum Status {
        Roles,
        client,
        freelancer,

    }

   
contract paymentMilestone{
    uint256 paymentMilestone;

    struct payment {
        uint id;
        address payable creator;
        string text;
        Status status;
        uint deadline;
        uint freelancer;
    }

  


    mapping(uint => payment) payments;

    event paymentCreated(string text, uint deadline);


function creatpayment(string memory _text, uint _freelancer) external returns(uint){
    require(bytes(_text).length > 0, "Empty text");
    require(_freelancer > 0, "Invalid freelancer");
    require(msg.sender != address(0), "Zero address");


    emit paymentCreated(_text, _freelancer);
    return payment; 


    
}

