// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20.sol";
import "./Staking.sol";

contract ProtocolFactory {

    address[] public allProtocols;

    struct Protocol {
        address stakeToken;
        address rewardToken;
        address exchangeToken;
        address stakingContract;
    }

    Protocol[] public protocols;

    function createProtocol(
        string memory stakeName,
        string memory stakeSymbol,
        uint256 stakeSupply,
        uint256 rewardRate
    ) external {

    
        ERC20 stakeToken = new ERC20(
            stakeName,
            stakeSymbol,
            18,
            stakeSupply
        );


        ERC20 rewardToken = new ERC20(
            "Reward Token",
            "RWD",
            18,
            0
        );

        
        ERC20 exchangeToken = new ERC20(
            "Exchange Token",
            "xSTK",
            18,
            0
        );

        Staking staking = new Staking(
            address(stakeToken),
            address(rewardToken),
            address(exchangeToken),
            rewardRate
        );

        
        rewardToken.transferOwnership(address(staking));
        exchangeToken.transferOwnership(address(staking));

        // 
        protocols.push(
            Protocol(
                address(stakeToken),
                address(rewardToken),
                address(exchangeToken),
                address(staking)
            )
        );

        allProtocols.push(address(staking));
    }
}