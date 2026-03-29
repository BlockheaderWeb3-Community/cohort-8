import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("TimelockedVault", function () {
  let vault: any;
  let owner: any;
  let user: any;

  const ONE_ETH = ethers.parseEther("1");

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    vault = await ethers.deployContract("TimelockedVault");
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await vault.getAddress()).to.properAddress;
    });
  });

  describe("Deposit", function () {
    it("Should allow valid deposit", async function () {
      const block = await ethers.provider.getBlock("latest");
      const unlockTime = block!.timestamp + 3600;

      await vault.connect(user).deposit(unlockTime, { value: ONE_ETH });

      const savings = await vault.savings(user.address);
      expect(savings.balance).to.equal(ONE_ETH);
      expect(savings.unlockTime).to.equal(unlockTime);
    });

    it("Should revert if deposit is zero", async function () {
      const block = await ethers.provider.getBlock("latest");
      const unlockTime = block!.timestamp + 3600;

      await expect(
        vault.connect(user).deposit(unlockTime, { value: 0 })
      ).to.be.revertedWith("Deposit must be greater than 0");
    });

    it("Should revert if unlock time is in the past", async function () {
      const block = await ethers.provider.getBlock("latest");
      const unlockTime = block!.timestamp - 1;

      await expect(
        vault.connect(user).deposit(unlockTime, { value: ONE_ETH })
      ).to.be.revertedWith("Unlock time must be in the future");
    });

    it("Should revert if vault already active", async function () {
      const block = await ethers.provider.getBlock("latest");
      const unlockTime = block!.timestamp + 3600;

      await vault.connect(user).deposit(unlockTime, { value: ONE_ETH });

      await expect(
        vault.connect(user).deposit(unlockTime + 1000, { value: ONE_ETH })
      ).to.be.revertedWith("Vault already active");
    });
  });

  describe("Withdraw", function () {
    it("Should revert if no active vault", async function () {
      await expect(
        vault.connect(user).withdraw()
      ).to.be.revertedWith("No active vault");
    });

    it("Should revert if vault still locked", async function () {
      const block = await ethers.provider.getBlock("latest");
      const unlockTime = block!.timestamp + 3600;

      await vault.connect(user).deposit(unlockTime, { value: ONE_ETH });

      await expect(
        vault.connect(user).withdraw()
      ).to.be.revertedWith("Vault is still locked");
    });
  });

  describe("Receive / Fallback", function () {
    it("Should revert if ETH sent directly", async function () {
      await expect(
        user.sendTransaction({
          to: await vault.getAddress(),
          value: ONE_ETH,
        })
      ).to.be.revertedWith("Use deposit function");
    });
  });
});