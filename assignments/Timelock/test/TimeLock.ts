import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

const { time, loadFixture } = networkHelpers;

describe("TimeLock", function () {
  const ONE_DAY_IN_SECS = 24 * 60 * 60;
  const DEPOSIT_AMOUNT = ethers.parseEther("1.0");

  async function deployTimeLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TimeLock = await ethers.getContractFactory("TimeLock");
    const timelock = await TimeLock.deploy();

    return { timelock, owner, otherAccount };
  }

  describe("Deposits", function () {
    it("Should create a vault with correct balance and unlock time", async function () {
      const { timelock, owner } = await loadFixture(deployTimeLockFixture);
      const unlockTime = (await time.latest()) + ONE_DAY_IN_SECS;

      await expect(timelock.deposit(unlockTime, { value: DEPOSIT_AMOUNT }))
        .to.emit(timelock, "Deposited")
        .withArgs(owner.address, 0, DEPOSIT_AMOUNT, unlockTime);

      const vault = await timelock.getVault(owner.address, 0);
      expect(vault.balance).to.equal(DEPOSIT_AMOUNT);
      expect(vault.unlockTime).to.equal(unlockTime);
      expect(vault.active).to.be.true;
    });

    it("Should revert if deposit is 0", async function () {
      const { timelock } = await loadFixture(deployTimeLockFixture);
      const unlockTime = (await time.latest()) + ONE_DAY_IN_SECS;

      await expect(timelock.deposit(unlockTime, { value: 0 }))
        .to.be.revertedWith("Deposit must be greater than zero");
    });

    it("Should revert if unlock time is in the past", async function () {
      const { timelock } = await loadFixture(deployTimeLockFixture);
      const pastTime = (await time.latest()) - 100;

      await expect(timelock.deposit(pastTime, { value: DEPOSIT_AMOUNT }))
        .to.be.revertedWith("Unlock time must be in the future");
    });
  });

  describe.only("Withdrawals", function () {
    it("Should fail if funds are still locked", async function () {
      const { timelock } = await loadFixture(deployTimeLockFixture);
      const unlockTime = (await time.latest()) + ONE_DAY_IN_SECS;

      await timelock.deposit(unlockTime, { value: DEPOSIT_AMOUNT });
      await expect(timelock.withdraw(0)).to.be.revertedWith("Funds are still locked");
    });

    it("Should succeed if unlock time has passed", async function () {
      const { timelock, owner } = await loadFixture(deployTimeLockFixture);
      const unlockTime = (await time.latest()) + ONE_DAY_IN_SECS;

      await timelock.deposit(unlockTime, { value: DEPOSIT_AMOUNT });

      // Move time forward
      await time.increaseTo(unlockTime);

      await expect(timelock.withdraw(0))
        .to.emit(timelock, "Withdrawn")
        .withArgs(owner.address, 0, DEPOSIT_AMOUNT);

      const vault = await timelock.getVault(owner.address, 0);
      expect(vault.active).to.be.false;
      expect(vault.balance).to.equal(0);
    });

    it("Should fail if trying to withdraw from an inactive vault", async function () {
      const { timelock } = await loadFixture(deployTimeLockFixture);
      const unlockTime = (await time.latest()) + ONE_DAY_IN_SECS;

      await timelock.deposit(unlockTime, { value: DEPOSIT_AMOUNT });
      await time.increaseTo(unlockTime);
      await timelock.withdraw(0);

      await expect(timelock.withdraw(0)).to.be.revertedWith("Vault is not active");
    });
  });

  describe("WithdrawAll", function () {
    it("Should withdraw from multiple unlocked vaults at once", async function () {
      const { timelock, owner } = await loadFixture(deployTimeLockFixture);
      const now = await time.latest();

      // Deposit into 3 vaults with different times
      await timelock.deposit(now + ONE_DAY_IN_SECS, { value: DEPOSIT_AMOUNT }); // Vault 0
      await timelock.deposit(now + ONE_DAY_IN_SECS * 2, { value: DEPOSIT_AMOUNT }); // Vault 1
      await timelock.deposit(now + ONE_DAY_IN_SECS * 10, { value: DEPOSIT_AMOUNT }); // Vault 2 (remains locked)

      // Move time to unlock first two vaults
      await time.increase(ONE_DAY_IN_SECS * 3);

      const expectedTransfer = DEPOSIT_AMOUNT * BigInt(2);

      await expect(timelock.withdrawAll())
        .to.changeEtherBalance(ethers, owner, expectedTransfer);

      expect(await timelock.getTotalBalance(owner.address)).to.equal(DEPOSIT_AMOUNT); // Only Vault 2 remains
    });

    it("Should revert if no vaults are ready for withdrawal", async function () {
      const { timelock } = await loadFixture(deployTimeLockFixture);
      const unlockTime = (await time.latest()) + ONE_DAY_IN_SECS;

      await timelock.deposit(unlockTime, { value: DEPOSIT_AMOUNT });
      await expect(timelock.withdrawAll()).to.be.revertedWith("No unlocked funds available");
    });
  });

  describe("View Functions", function () {
    it("Should correctly track total and unlocked balances", async function () {
      const { timelock, owner } = await loadFixture(deployTimeLockFixture);
      const now = await time.latest();

      await timelock.deposit(now + 100, { value: ethers.parseEther("1") });
      await timelock.deposit(now + 1000, { value: ethers.parseEther("2") });

      expect(await timelock.getTotalBalance(owner.address)).to.equal(ethers.parseEther("3"));
      expect(await timelock.getUnlockedBalance(owner.address)).to.equal(0);

      await time.increase(200);
      expect(await timelock.getUnlockedBalance(owner.address)).to.equal(ethers.parseEther("1"));
    });

    it("Should return only active vaults data", async function () {
      const { timelock, owner } = await loadFixture(deployTimeLockFixture);
      const now = await time.latest();

      await timelock.deposit(now + 100, { value: DEPOSIT_AMOUNT });
      await timelock.deposit(now + 200, { value: DEPOSIT_AMOUNT });

      // Withdraw the first one
      await time.increase(150);
      await timelock.withdraw(0);

      const activeData = await timelock.getActiveVaults(owner.address);
      expect(activeData.activeVaults.length).to.equal(1);
      expect(activeData.activeVaults[0]).to.equal(1); // Index of the second vault
    });
  });
});
