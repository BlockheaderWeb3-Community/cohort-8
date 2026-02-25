import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { network } from "hardhat";

describe("Staking Protocol", async function () {
  let viem: any;
  let publicClient: any;
  let stakingToken: any;
  let rewardToken: any;
  let stakingPool: any;
  let stakingFactory: any;
  let owner: any;
  let user1: any;
  let user2: any;

  const REWARD_RATE = 1000000000000000000n; // 1 token per second (18 decimals)
  const LOCK_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds
  const PENALTY_RATE = 1000; // 10% penalty (in basis points)
  const INITIAL_SUPPLY = 1000000000000000000000000n; // 1 million tokens

  beforeEach(async function () {
    const connection = await network.connect();
    viem = connection.viem;
    publicClient = await viem.getPublicClient();
    
    const wallets = await viem.getWalletClients();
    owner = wallets[0];
    user1 = wallets[1];
    user2 = wallets[2];

    // Deploy staking token
    stakingToken = await viem.deployContract("ERC20", [
      "Staking Token",
      "STK",
      18,
      INITIAL_SUPPLY,
    ]);

    // Deploy reward token
    rewardToken = await viem.deployContract("ERC20", [
      "Reward Token",
      "RWD",
      18,
      INITIAL_SUPPLY,
    ]);

    // Deploy StakingPool
    stakingPool = await viem.deployContract("StakingPool", [
      stakingToken.address,
      rewardToken.address,
      REWARD_RATE,
      LOCK_PERIOD,
      PENALTY_RATE,
    ]);

    // Deploy StakingFactory
    stakingFactory = await viem.deployContract("StakingFactory", []);

    // Transfer some tokens to users for testing
    await stakingToken.write.transfer([user1.account.address, 10000000000000000000000n]);
    await stakingToken.write.transfer([user2.account.address, 10000000000000000000000n]);
    await rewardToken.write.transfer([user1.account.address, 10000000000000000000000n]);
    await rewardToken.write.transfer([user2.account.address, 10000000000000000000000n]);

    // Fund the staking pool with reward tokens
    await rewardToken.write.transfer([stakingPool.address, 100000000000000000000000n]);
  });

  // Helper function to increase time
  async function increaseTime(seconds: number) {
    await publicClient.transport.request({
      method: "evm_increaseTime",
      params: [seconds],
    });
    await publicClient.transport.request({
      method: "evm_mine",
      params: [],
    });
  }

  describe("StakingPool - Basic Staking", function () {
    it("Should allow users to stake tokens", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      // User1 approves and stakes
      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      const userInfo = await stakingPool.read.getUserInfo([user1.account.address]);
      assert.equal(userInfo[0], stakeAmount);
    });

    it("Should not allow staking 0 tokens", async function () {
      await assert.rejects(
        stakingPool.write.stake([0n], { account: user1.account }),
        /Cannot stake 0/
      );
    });

    it("Should update total staked correctly", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      const totalStaked = await stakingPool.read.totalStaked();
      assert.equal(totalStaked, stakeAmount);
    });
  });

  describe("StakingPool - Reward Distribution", function () {
    it("Should accumulate rewards over time", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      // Wait for some time (increase time by 100 seconds)
      await increaseTime(100);

      const earned = await stakingPool.read.earned([user1.account.address]);
      assert.ok(earned > 0n, "Rewards should be greater than 0");
    });

    it("Should allow claiming rewards", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      // Wait for some time
      await increaseTime(100);

      const earnedBefore = await stakingPool.read.earned([user1.account.address]);
      assert.ok(earnedBefore > 0n, "Should have earned rewards");

      // Claim rewards
      const balanceBefore = await rewardToken.read.balanceOf([user1.account.address]);
      await stakingPool.write.claimRewards({ account: user1.account });
      const balanceAfter = await rewardToken.read.balanceOf([user1.account.address]);

      assert.ok(balanceAfter > balanceBefore, "Balance should increase after claiming");
    });
  });

  describe("StakingPool - Withdrawals", function () {
    it("Should allow withdrawal after lock period", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      // Wait for lock period to pass
      await increaseTime(LOCK_PERIOD + 1);

      const balanceBefore = await stakingToken.read.balanceOf([user1.account.address]);
      await stakingPool.write.withdraw([stakeAmount], { account: user1.account });
      const balanceAfter = await stakingToken.read.balanceOf([user1.account.address]);

      assert.equal(balanceAfter - balanceBefore, stakeAmount);
    });

    it("Should apply penalty for early withdrawal", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      // Don't wait for lock period - withdraw immediately
      const balanceBefore = await stakingToken.read.balanceOf([user1.account.address]);
      await stakingPool.write.withdraw([stakeAmount], { account: user1.account });
      const balanceAfter = await stakingToken.read.balanceOf([user1.account.address]);

      const expectedPenalty = (stakeAmount * BigInt(PENALTY_RATE)) / 10000n;
      const expectedWithdrawal = stakeAmount - expectedPenalty;

      assert.equal(balanceAfter - balanceBefore, expectedWithdrawal);
    });

    it("Should not allow over-withdrawal", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      await assert.rejects(
        stakingPool.write.withdraw([stakeAmount + 1n], { account: user1.account }),
        /Insufficient staked balance/
      );
    });
  });

  describe("StakingPool - Emergency Withdraw", function () {
    it("Should allow emergency withdrawal", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      const balanceBefore = await stakingToken.read.balanceOf([user1.account.address]);
      await stakingPool.write.emergencyWithdraw({ account: user1.account });
      const balanceAfter = await stakingToken.read.balanceOf([user1.account.address]);

      // Should receive tokens (minus penalty)
      assert.ok(balanceAfter > balanceBefore, "Should receive tokens back");
    });

    it("Should reset user stake after emergency withdrawal", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      await stakingPool.write.emergencyWithdraw({ account: user1.account });

      const userInfo = await stakingPool.read.getUserInfo([user1.account.address]);
      assert.equal(userInfo[0], 0n);
    });
  });

  describe("StakingPool - Configuration", function () {
    it("Should update reward rate", async function () {
      const newRate = 2000000000000000000n; // 2 tokens per second
      await stakingPool.write.setRewardRate([newRate]);

      const rate = await stakingPool.read.rewardRate();
      assert.equal(rate, newRate);
    });

    it("Should update lock period", async function () {
      const newPeriod = 14 * 24 * 60 * 60; // 14 days
      await stakingPool.write.setLockPeriod([newPeriod]);

      const period = await stakingPool.read.lockPeriod();
      assert.equal(period, BigInt(newPeriod));
    });

    it("Should update penalty rate", async function () {
      const newRate = 2000; // 20%
      await stakingPool.write.setPenaltyRate([newRate]);

      const rate = await stakingPool.read.penaltyRate();
      assert.equal(rate, BigInt(newRate));
    });

    it("Should not allow penalty rate above 100%", async function () {
      await assert.rejects(
        stakingPool.write.setPenaltyRate([10001]),
        /Penalty rate too high/
      );
    });
  });

  describe("StakingFactory - Pool Management", function () {
    it("Should create a new staking pool", async function () {
      await stakingFactory.write.createPool([
        stakingToken.address,
        rewardToken.address,
        REWARD_RATE,
        LOCK_PERIOD,
        PENALTY_RATE,
      ]);

      const poolCount = await stakingFactory.read.poolCount();
      assert.equal(poolCount, 1n);
    });

    it("Should track created pools", async function () {
      await stakingFactory.write.createPool([
        stakingToken.address,
        rewardToken.address,
        REWARD_RATE,
        LOCK_PERIOD,
        PENALTY_RATE,
      ]);

      const poolInfo = await stakingFactory.read.getPool([0n]);
      // Compare addresses case-insensitively
      assert.equal(
        poolInfo.stakingToken.toLowerCase(),
        stakingToken.address.toLowerCase()
      );
      assert.equal(
        poolInfo.rewardToken.toLowerCase(),
        rewardToken.address.toLowerCase()
      );
      assert.equal(poolInfo.active, true);
    });

    it("Should deactivate a pool", async function () {
      await stakingFactory.write.createPool([
        stakingToken.address,
        rewardToken.address,
        REWARD_RATE,
        LOCK_PERIOD,
        PENALTY_RATE,
      ]);

      await stakingFactory.write.deactivatePool([0n]);
      const poolInfo = await stakingFactory.read.getPool([0n]);
      assert.equal(poolInfo.active, false);
    });

    it("Should activate a pool", async function () {
      await stakingFactory.write.createPool([
        stakingToken.address,
        rewardToken.address,
        REWARD_RATE,
        LOCK_PERIOD,
        PENALTY_RATE,
      ]);

      await stakingFactory.write.deactivatePool([0n]);
      await stakingFactory.write.activatePool([0n]);
      const poolInfo = await stakingFactory.read.getPool([0n]);
      assert.equal(poolInfo.active, true);
    });

    it("Should return all pools", async function () {
      await stakingFactory.write.createPool([
        stakingToken.address,
        rewardToken.address,
        REWARD_RATE,
        LOCK_PERIOD,
        PENALTY_RATE,
      ]);

      await stakingFactory.write.createPool([
        stakingToken.address,
        rewardToken.address,
        REWARD_RATE * 2n,
        LOCK_PERIOD,
        PENALTY_RATE,
      ]);

      const allPools = await stakingFactory.read.getAllPools();
      assert.equal(allPools.length, 2);
    });

    it("Should only allow owner to create pools", async function () {
      await assert.rejects(
        stakingFactory.write.createPool(
          [
            stakingToken.address,
            rewardToken.address,
            REWARD_RATE,
            LOCK_PERIOD,
            PENALTY_RATE,
          ],
          { account: user1.account }
        ),
        /Not owner/
      );
    });
  });

  describe("StakingPool - View Functions", function () {
    it("Should return correct user info", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      const userInfo = await stakingPool.read.getUserInfo([user1.account.address]);
      assert.equal(userInfo[0], stakeAmount);
      assert.ok(userInfo[2] > 0n, "Stake time should be greater than 0");
    });

    it("Should correctly report if user can withdraw without penalty", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      // Before lock period
      const canWithdrawBefore = await stakingPool.read.canWithdrawWithoutPenalty([
        user1.account.address,
      ]);
      assert.equal(canWithdrawBefore, false);

      // After lock period
      await increaseTime(LOCK_PERIOD + 1);

      const canWithdrawAfter = await stakingPool.read.canWithdrawWithoutPenalty([
        user1.account.address,
      ]);
      assert.equal(canWithdrawAfter, true);
    });

    it("Should return time until unlock", async function () {
      const stakeAmount = 100000000000000000000n; // 100 tokens

      await stakingToken.write.approve([stakingPool.address, stakeAmount], {
        account: user1.account,
      });
      await stakingPool.write.stake([stakeAmount], { account: user1.account });

      const timeRemaining = await stakingPool.read.timeUntilUnlock([user1.account.address]);
      // Should be close to LOCK_PERIOD (within a few seconds due to block time)
      assert.ok(
        timeRemaining > BigInt(LOCK_PERIOD - 10) && timeRemaining <= BigInt(LOCK_PERIOD),
        "Time remaining should be close to lock period"
      );
    });
  });
});
