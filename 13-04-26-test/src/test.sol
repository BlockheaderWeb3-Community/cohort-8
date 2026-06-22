//SPDX Licensense Identifier: MIT
pragma solidity ^0.8.31;

contract Test {
mapping(address => uint256) public balances;

function deposit() public payable {
    balances[msg.sender] += msg.value;
}

// function withdraw(uint256 amount) public {
//     require(balances[msg.sender] >= amount, "Insufficient balance");

//     (bool success, ) = msg.sender.call{value: amount}("");
//     require(success, "Transfer failed");

//     balances[msg.sender] -= amount;
//}


//fix withdraw functions
function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");

    balances[msg.sender] -= amount;

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");

}
}