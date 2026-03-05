// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title CounterV3
 * @dev Version 3: Owner-only access + Privilege system
 * Owner can grant/revoke privilege to non-owners to call state-changing functions
 */
contract CounterV3 {
    uint public x;
    address public owner;
    mapping(address => bool) public privileged;

    event Increment(uint by);
    event Decrement(uint by);
    event PrivilegeGranted(address indexed account);
    event PrivilegeRevoked(address indexed account);

    modifier onlyOwner() {
        require(msg.sender == owner, "CounterV3: caller is not the owner");
        _;
    }

    modifier onlyOwnerOrPrivileged() {
        require(
            msg.sender == owner || privileged[msg.sender],
            "CounterV3: caller is not owner or privileged"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function inc() public onlyOwnerOrPrivileged {
        x++;
        emit Increment(1);
    }

    function incBy(uint by) public onlyOwnerOrPrivileged {
        require(by > 0, "incBy: increment should be positive");
        x += by;
        emit Increment(by);
    }

    /**
     * @dev Decreases the counter by the specified amount
     * @param by The amount to decrease (must be positive and not exceed current counter value)
     */
    function decrease(uint by) public onlyOwnerOrPrivileged {
        require(by > 0, "decrease: decrement should be positive");
        require(x >= by, "decrease: counter cannot go below zero");
        x -= by;
        emit Decrement(by);
    }

    /**
     * @dev Grants privilege to a non-owner to call state-changing functions
     * @param account The address to grant privilege to
     */
    function grantPrivilege(address account) public onlyOwner {
        require(account != address(0), "CounterV3: invalid address");
        require(account != owner, "CounterV3: owner is already privileged");
        privileged[account] = true;
        emit PrivilegeGranted(account);
    }

    /**
     * @dev Revokes privilege from a non-owner
     * @param account The address to revoke privilege from
     */
    function revokePrivilege(address account) public onlyOwner {
        require(privileged[account], "CounterV3: account is not privileged");
        privileged[account] = false;
        emit PrivilegeRevoked(account);
    }
}
