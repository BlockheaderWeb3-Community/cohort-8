// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract MileStonePayment{
    struct Mile {
        address client;
        address freelancer;
        uint mileStones;
        uint mileStoneDone;
        uint ethPerMileStone;
        bool isDone;
    }


    mapping ( uint => Mile) mileStoneStorage;

    uint public mileCounter;

    function  createJob(address _freelancer, uint _mileStones, uint _ethPerMileStone ) external payable returns (uint) {
        mileCounter++;
        mileStoneStorage[mileCounter] = Mile({
            client: msg.sender,
            freelancer: _freelancer,
            mileStones: _mileStones,
            ethPerMileStone: _ethPerMileStone,
            isDone: false,
            mileStoneDone: 0
        });

        return mileCounter;
    }


    function tickMileStone(uint _id) external {
        Mile storage storedMiles = mileStoneStorage[_id];
        require(msg.sender == storedMiles.freelancer, "Only freelancer can tick mileStone");
        require(storedMiles.isDone == false, "Job already completed");
        
        storedMiles.mileStones += 1;

    }

    function confirmMileStone(uint _id) external {
        Mile storage storedMiles = mileStoneStorage[_id];
        require(msg.sender == storedMiles.client, "Only client that can confrim milestone");
        require(storedMiles.isDone == false, "Job already completed");

        (bool success,) = storedMiles.freelancer.call{value: storedMiles.ethPerMileStone}("");
        require(success, "Transafer failed");

        storedMiles.mileStones == storedMiles.mileStoneDone;
        storedMiles.isDone == true;

    }





}