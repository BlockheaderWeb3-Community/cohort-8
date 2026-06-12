// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./MockERC20.sol";

/**
 * @dev ERC20 that triggers a reentrancy attempt during `transferFrom` into the staking pool.
 */
contract ReentrantERC20 is MockERC20 {
    address public stakingPool;
    address public attacker;
    uint256 public reenterAmount;
    bool public enabled;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        address initialHolder,
        uint256 initialSupply
    ) MockERC20(name_, symbol_, decimals_, initialHolder, initialSupply) {}

    function setReenterConfig(
        address _stakingPool,
        address _attacker,
        uint256 _reenterAmount,
        bool _enabled
    ) external {
        stakingPool = _stakingPool;
        attacker = _attacker;
        reenterAmount = _reenterAmount;
        enabled = _enabled;
    }

    function transferFrom(address from, address to, uint256 amount)
        public
        override
        returns (bool)
    {
        if (enabled && to == stakingPool && attacker != address(0)) {
            bytes memory data = abi.encodeWithSignature("tryWithdraw(uint256)", reenterAmount);
            (bool ok, bytes memory returndata) = attacker.call(data);
            if (!ok) {
                assembly {
                    revert(add(returndata, 32), mload(returndata))
                }
            }
        }
        return super.transferFrom(from, to, amount);
    }
}

