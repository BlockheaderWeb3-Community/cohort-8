// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Loner} from "../src/token.sol";
import {TimeLockV1} from "../src/TimeLockV1.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the Loner token
        Loner token = new Loner(msg.sender);
        console.log("Token deployed at:", address(token));

        // Deploy TimeLock with token address
        TimeLockV1 timelock = new TimeLockV1(address(token));
        console.log("TimeLock deployed at:", address(timelock));

        // Grant MINTER_ROLE to TimeLock so it can mint tokens
        token.grantRole(token.MINTER_ROLE(), address(timelock));
        console.log("MINTER_ROLE granted to TimeLock");

        vm.stopBroadcast();
    }
}
