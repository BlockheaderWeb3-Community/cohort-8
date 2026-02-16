//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./TimeLock.sol";

contract TimeLockFactory {
       address[] public deployedTimeLocks;
    
       mapping(address => address[]) public timeLocksByDeployer;
    
    event TimeLockCreated(address indexed timeLockAddress, address indexed deployer);
   function createTimeLock() external returns (address) {
        TimeLock newTimeLock = new TimeLock();
        address timeLockAddress = address(newTimeLock);
        
        deployedTimeLocks.push(timeLockAddress);
        timeLocksByDeployer[msg.sender].push(timeLockAddress);
        
        emit TimeLockCreated(timeLockAddress, msg.sender);
        
        return timeLockAddress;
    }
   function getDeployedTimeLocks() external view returns (address[] memory) {
        return deployedTimeLocks;
    }
   function getTimeLocksByDeployer(address _deployer) external view returns (address[] memory) {
        return timeLocksByDeployer[_deployer];
    }
   function getDeployedTimeLocksCount() external view returns (uint) {
        return deployedTimeLocks.length;
    }
}
