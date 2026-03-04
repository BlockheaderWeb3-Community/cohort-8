// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ILoner - Interface for the Loner token
 * @notice Defines the functions TimeLock needs from the token contract
 */
interface ILoner {
    function mint(address to, uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function BURNER_ROLE() external view returns (bytes32);
}
