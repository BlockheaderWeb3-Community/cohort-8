import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Staking Contract Tests", function () {
  let stakingToken: any;
  let rewardToken: any;
  let staking: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let penaltyRecipient: any;

  const REWARD_RATE = ethers.parseEther("0.1"); // 0.1 token per second
  const STAKE_AMOUNT = ethers.parseEther("100"); // 100 tokens

  beforeEach(async function () {
    [owner, user1, user2, penaltyRecipient] = await ethers.getSigners();

    // Deploy staking token
    stakingToken = await ethers.deployContract("RewardToken", ["Staking Token", "STK", 18]);

    // Deploy reward token
    rewardToken = await ethers.deployContract("RewardToken", ["Reward Token", "RWD", 18]);

    // Deploy staking contract
    staking = await ethers.deployContract("Staking", [
      await stakingToken.getAddress(),
      await rewardToken.getAddress(),
      REWARD_RATE,
      penaltyRecipient.address
    ]);

    // Mint tokens to users
    await stakingToken.mint(user1.address, ethers.parseEther("1000"));
    await stakingToken.mint(user2.address, ethers.parseEther("1000"));
    await rewardToken.mint(staking.address, ethers.parseEther("100000"));
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      // Approve staking contract
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);

      // Stake tokens
      await staking.connect(user1).stake(STAKE_AMOUNT);

      // Check staked amount
      const staked = await staking.stakedAmount(user1.address);
      expect(staked).to.equal(STAKE_AMOUNT);

      // Check total staked
      const totalStaked = await staking.totalStaked();
      expect(totalStaked).to.equal(STAKE_AMOUNT);
    });

    it("Should fail when staking 0 tokens", async function () {
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);

      await expect(staking.connect(user1).stake(0)).to.be.revertedWith(
        "Staking: cannot stake 0"
      );
    });

    it("Should fail when staking without approval", async function () {
      await expect(staking.connect(user1).stake(STAKE_AMOUNT)).to.be.reverted;
    });

    it("Should allow multiple users to stake", async function () {
      // User1 stakes
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT);

      // User2 stakes
      await stakingToken.connect(user2).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user2).stake(STAKE_AMOUNT);

      expect(await staking.totalStaked()).to.equal(STAKE_AMOUNT * 2n);
    });
  });

  describe("Reward Distribution", function () {
    beforeEach(async function () {
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should accrue rewards over time", async function () {
      // Wait for some time
      await ethers.provider.send("evm_increaseTime", [100]); // 100 seconds
      await ethers.provider.send("evm_mine", []);

      const earned = await staking.earned(user1.address);
      expect(earned).to.be.gt(0);
    });

    it("Should calculate rewards proportionally to staked amount", async function () {
      // User2 stakes the same amount
      await stakingToken.connect(user2).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user2).stake(STAKE_AMOUNT);

      // Wait for time
      await ethers.provider.send("evm_increaseTime", [100]);
      await ethers.provider.send("evm_mine", []);

      const earned1 = await staking.earned(user1.address);
      const earned2 = await staking.earned(user2.address);

      // Both should earn the same since they staked the same amount
      expect(earned1).to.equal(earned2);
    });
  });

  describe("Claim Rewards", function () {
    beforeEach(async function () {
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should allow users to claim rewards", async function () {
      // Wait for rewards to accumulate
      await ethers.provider.send("evm_increaseTime", [100]);
      await ethers.provider.send("evm_mine", []);

      const earnedBefore = await staking.earned(user1.address);
      expect(earnedBefore).to.be.gt(0);

      // Claim rewards
      await staking.connect(user1).claimRewards();

      const earnedAfter = await staking.earned(user1.address);
      expect(earnedAfter).to.equal(0);
    });

    it("Should fail when claiming with no rewards", async function () {
      // Stake new user with no time passed
      await stakingToken.connect(user2).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user2).stake(STAKE_AMOUNT);

      await expect(staking.connect(user2).claimRewards()).to.be.revertedWith(
        "Staking: no rewards to claim"
      );
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should allow users to withdraw stake and rewards", async function () {
      // Wait for rewards
      await ethers.provider.send("evm_increaseTime", [100]);
      await ethers.provider.send("evm_mine", []);

      const balanceBefore = await stakingToken.balanceOf(user1.address);

      // Withdraw
      await staking.connect(user1).withdraw();

      const balanceAfter = await stakingToken.balanceOf(user1.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should fail when withdrawing with no stake", async function () {
      await expect(staking.connect(user2).withdraw()).to.be.revertedWith(
        "Staking: nothing to withdraw"
      );
    });
  });

  describe("Emergency Withdraw", function () {
    beforeEach(async function () {
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should allow emergency withdraw", async function () {
      const balanceBefore = await stakingToken.balanceOf(user1.address);

      await staking.connect(user1).emergencyWithdraw();

      const balanceAfter = await stakingToken.balanceOf(user1.address);
      expect(balanceAfter).to.equal(balanceBefore + STAKE_AMOUNT);

      const staked = await staking.stakedAmount(user1.address);
      expect(staked).to.equal(0);
    });

    it("Should fail emergency withdraw when nothing staked", async function () {
      await expect(staking.connect(user2).emergencyWithdraw()).to.be.revertedWith(
        "Staking: nothing to withdraw"
      );
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to update reward rate", async function () {
      const newRate = ethers.parseEther("0.2");
      await staking.updateRewardRate(newRate);

      const currentRate = await staking.rewardRate();
      expect(currentRate).to.equal(newRate);
    });

    it("Should allow owner to update lock period", async function () {
      const newPeriod = 60 * 24 * 60 * 60; // 60 days
      await staking.updateLockPeriod(newPeriod);

      const currentPeriod = await staking.lockPeriod();
      expect(currentPeriod).to.equal(newPeriod);
    });

    it("Should allow owner to update penalty", async function () {
      const newPenalty = 500; // 5%
      await staking.updatePenalty(newPenalty);

      const currentPenalty = await staking.earlyWithdrawPenalty();
      expect(currentPenalty).to.equal(newPenalty);
    });

    it("Should fail when non-owner tries to update parameters", async function () {
      await expect(staking.connect(user1).updateRewardRate(ethers.parseEther("0.2"))).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("Lock Period & Penalty", function () {
    beforeEach(async function () {
      await stakingToken.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should apply penalty for early withdrawal", async function () {
      // Try to withdraw immediately (within lock period)
      const penaltyRecipientBefore = await stakingToken.balanceOf(penaltyRecipient.address);

      await staking.connect(user1).withdraw();

      const penaltyRecipientAfter = await stakingToken.balanceOf(penaltyRecipient.address);
      expect(penaltyRecipientAfter).to.be.gt(penaltyRecipientBefore);
    });

    it("Should check if user is in lock period", async function () {
      const inLockPeriod = await staking.isInLockPeriod(user1.address);
      expect(inLockPeriod).to.equal(true);

      // Increase time past lock period
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // 31 days
      await ethers.provider.send("evm_mine", []);

      const afterLockPeriod = await staking.isInLockPeriod(user1.address);
      expect(afterLockPeriod).to.equal(false);
    });
  });
});
