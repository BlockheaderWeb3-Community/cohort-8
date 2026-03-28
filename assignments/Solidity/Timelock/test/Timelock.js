import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TimelockedVault", function () {
  async function deployVaultFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TimelockedVault = await ethers.getContractFactory("TimelockedVault");
    const vault = await TimelockedVault.deploy();

    return { vault, owner, otherAccount };
  }

  describe("Deposit", function () {
    it("Should set the correct unlock time and amount", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);
      const depositAmount = ethers.parseEther("1");
      const unlockTime = (await time.latest()) + 3600n; // 1 hour from now

      await vault.deposit(unlockTime, { value: depositAmount });

      const userVault = await vault.vaults(owner.address);
      expect(userVault.amount).to.equal(depositAmount);
      expect(userVault.unlockTime).to.equal(unlockTime);
      expect(userVault.status).to.equal(true);
    });

    it("Should revert if deposit is 0", async function () {
      const { vault } = await loadFixture(deployVaultFixture);
      const unlockTime = (await time.latest()) + 3600n;
      await expect(vault.deposit(unlockTime, { value: 0 }))
        .to.be.revertedWith("Make a minimum deposit greater than 0Eth");
    });
  });

  describe("Withdrawal", function () {
    it("Should fail if called before unlock time", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);
      const unlockTime = (await time.latest()) + 3600n;

      await vault.deposit(unlockTime, { value: ethers.parseEther("1") });
      await expect(vault.withdraw()).to.be.revertedWith("Vault is still locked");
    });

    it("Should succeed after unlock time and transfer ETH", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);
      const depositAmount = ethers.parseEther("1");
      const unlockTime = (await time.latest()) + 3600n;

      await vault.deposit(unlockTime, { value: depositAmount });

      await time.increaseTo(unlockTime);

      await expect(vault.withdraw())
        .to.changeEtherBalances([owner, vault], [depositAmount, -depositAmount]);
    });
  });
});
