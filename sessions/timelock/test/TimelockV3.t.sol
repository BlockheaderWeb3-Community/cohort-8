// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {TimeLockV3} from "../src/TimelockV3.sol";
import {console} from "forge-std/console.sol";
import {IErc20} from "../src/interfaces/IERC20.sol";

contract TimelockV3Test is Test {
    IErc20 public token;
    TimeLockV3 public timelockV3;
    address public owner = 0xCe4F29b6A3955Fa50b46DFdFAe2F6352F16A77BB;
    address public addr1;
    address public addr2;

    function setUp() public {
        vm.startPrank(owner);
        timelockV3 = new TimeLockV3(0x6434193a115151156d038fB5B61747Cc5b07511F);
        addr1 = makeAddr("addr1");
        addr2 = makeAddr("addr2");
        token = IErc20(0x6434193a115151156d038fB5B61747Cc5b07511F);
        vm.stopPrank();
    }

    function fromWei(uint256 amount) public pure returns (uint256) {
        return (amount / 10 ** 9);
    }

    function test_deployment() public view {
        assertEq(timelockV3.owner(), owner);
        int256 price = timelockV3.getETHUSDPrice();
        console.log("ETH price here", price);

        uint8 decimalResult = timelockV3.getDecimals();
        console.log("decimals here", decimalResult);

        uint256 ownerEthBefore = token.balanceOf(owner);
        console.log("token decimals here____", token.decimals());
        assertEq(ownerEthBefore, (2000 * 10 ** 6));
    }

    function test_deposit() public {
        vm.startPrank(owner);
        uint256 unlockTime = block.timestamp + 1 days;
        // uint256 ownerEthBal1 = address(owner).balance;
        uint256 ownerEthBal1 = owner.balance;
        // console.log("owner balance 1___-", fromWei(ownerEthBal1));
        timelockV3.deposit{value: 0.01 ether}(unlockTime);

        // uint256 vaultEthBefore = address(vault).balance;
        // uint256 userTokenBefore = token.balanceOf(user);
        // uint256 vaultTokenBefore = token.balanceOf(address(vault));

        // vm.prank(user);
        // vault.deposit{value: 1 ether}(unlockTime);

        // assertEq(user.balance, userEthBefore - 1 ether);
        // assertEq(address(vault).balance, vaultEthBefore + 1 ether);
        // assertEq(token.balanceOf(user), userTokenBefore + 10 ether);
        // assertEq(token.balanceOf(address(vault)), vaultTokenBefore - 10 ether);
        // assertEq(vault.getVaultCount(user), 1);

        // (uint256 balance, uint256 tokenBalance, uint256 savedUnlockTime, bool active, bool isUnlocked) =
        //     vault.getVault(user, 0);

        // assertEq(balance, 1 ether);
        // assertEq(tokenBalance, 10 ether);
        // assertEq(savedUnlockTime, unlockTime);
        // assertTrue(active);
        // assertFalse(isUnlocked);
    }
}
