
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./MilestoneEscrow.sol";

contract MilestoneEscrowFactory {

    address[] public allEscrows;

    // user => escrows they are involved in
    mapping(address => address[]) public userEscrows;

    event EscrowCreated(
        address indexed client,
        address indexed freelancer,
        address escrow,
        uint256 milestones,
        uint256 amountPerMilestone
    );

    function createEscrow(
        address _freelancer,
        uint256 _milestoneCount,
        uint256 _amountPerMilestone
    ) external payable returns (address) {

        require(_freelancer != address(0), "Invalid freelancer");
        require(_freelancer != msg.sender, "Self-hire not allowed");
        require(_milestoneCount > 0, "Milestones = 0");
        require(_amountPerMilestone > 0, "Amount = 0");

        uint256 totalCost = _milestoneCount * _amountPerMilestone;
        require(msg.value == totalCost, "Wrong ETH sent");

        MilestoneEscrow escrow = new MilestoneEscrow{value: msg.value}(
            _freelancer,
            _milestoneCount,
            _amountPerMilestone
        );

        address escrowAddr = address(escrow);

        allEscrows.push(escrowAddr);

        userEscrows[msg.sender].push(escrowAddr);
        userEscrows[_freelancer].push(escrowAddr);

        emit EscrowCreated(
            msg.sender,
            _freelancer,
            escrowAddr,
            _milestoneCount,
            _amountPerMilestone
        );

        return escrowAddr;
    }

    function getUserEscrows(address user)
        external
        view
        returns (address[] memory)
    {
        return userEscrows[user];
    }

    function getAllEscrows()
        external
        view
        returns (address[] memory)
    {
        return allEscrows;
    }
}

