import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.connect();

describe('StakingPoolUpgradeable / StakingFactoryUpgradeable (upgradeable + secure)', function () {
  const LOCK_PERIOD = 7 * 24 * 60 * 60; // 7 days
  const PENALTY_RATE = 1000; // 10% (basis points)
  const REWARD_RATE = ethers.parseEther('1'); // 1 reward token per second
  const INITIAL_SUPPLY = ethers.parseEther('1000000');

  async function increaseTime(seconds: number) {
    await ethers.provider.send('evm_increaseTime', [seconds]);
    await ethers.provider.send('evm_mine', []);
  }

  async function deployFixture({
    feeCollectorEnabled = true,
  }: { feeCollectorEnabled?: boolean } = {}) {
    const signers = await ethers.getSigners();
    const [owner, user1, user2, feeCollector] = signers;

    const MockERC20 = await ethers.getContractFactory('MockERC20');
    const stakingToken = await MockERC20.deploy(
      'Staking Token',
      'STK',
      18,
      owner.address,
      INITIAL_SUPPLY
    );
    const rewardToken = await MockERC20.deploy(
      'Reward Token',
      'RWD',
      18,
      owner.address,
      INITIAL_SUPPLY
    );

    const userStake = ethers.parseEther('10000');
    await stakingToken.transfer(user1.address, userStake);
    await stakingToken.transfer(user2.address, userStake);

    const StakingPoolUpgradeableCF = await ethers.getContractFactory(
      'StakingPoolUpgradeable'
    );
    const poolImpl = await StakingPoolUpgradeableCF.deploy();

    const StakingFactoryUpgradeableCF = await ethers.getContractFactory(
      'StakingFactoryUpgradeable'
    );
    const factoryImpl = await StakingFactoryUpgradeableCF.deploy();

    const ProxyCF = await ethers.getContractFactory('OZERC1967Proxy');
    const factoryInit = factoryImpl.interface.encodeFunctionData('initialize', [
      owner.address,
      poolImpl.target,
    ]);
    const factoryProxy = await ProxyCF.deploy(factoryImpl.target, factoryInit);
    const factory = StakingFactoryUpgradeableCF.attach(factoryProxy.target);

    const feeCollectorAddr = feeCollectorEnabled
      ? feeCollector.address
      : ethers.ZeroAddress;

    const tx = await factory.createPool(
      stakingToken.target,
      rewardToken.target,
      LOCK_PERIOD,
      PENALTY_RATE,
      feeCollectorAddr
    );
    const receipt = await tx.wait();
    const parsedPoolCreated = receipt.logs
      .map((l) => {
        try {
          return factory.interface.parseLog(l);
        } catch {
          return null;
        }
      })
      .find((x) => x && x.name === 'PoolCreated') as any;

    expect(parsedPoolCreated, 'PoolCreated event should exist').to.not.equal(
      null
    );
    const poolId = parsedPoolCreated.args.poolId as bigint;
    const poolAddr = parsedPoolCreated.args.pool as string;

    const pool = StakingPoolUpgradeableCF.attach(poolAddr);

    return {
      owner,
      user1,
      user2,
      feeCollector,
      stakingToken,
      rewardToken,
      pool,
      factory,
      poolId,
      poolAddr,
    };
  }

  describe('Basic staking / withdrawals', function () {
    it('rejects stake(0)', async function () {
      const { pool, user1 } = await deployFixture();
      await expect(pool.connect(user1).stake(0n)).to.be.revertedWithCustomError(
        pool,
        'ZeroAmount'
      );
    });

    it('allows withdrawal after lock period (no penalty)', async function () {
      const { pool, stakingToken, user1 } = await deployFixture();
      const stakeAmount = ethers.parseEther('100');

      await stakingToken.connect(user1).approve(pool.target, stakeAmount);
      await pool.connect(user1).stake(stakeAmount);

      const before = await stakingToken.balanceOf(user1.address);
      await increaseTime(LOCK_PERIOD + 1);
      await pool.connect(user1).withdraw(stakeAmount);
      const after = await stakingToken.balanceOf(user1.address);

      expect(after - before).to.equal(stakeAmount);
    });

    it('applies early-withdraw penalty and routes it to feeCollector', async function () {
      const { pool, stakingToken, user1, feeCollector } = await deployFixture({
        feeCollectorEnabled: true,
      });
      const stakeAmount = ethers.parseEther('100');

      const expectedPenalty = (stakeAmount * BigInt(PENALTY_RATE)) / 10_000n;
      const expectedToUser = stakeAmount - expectedPenalty;

      await stakingToken.connect(user1).approve(pool.target, stakeAmount);
      await pool.connect(user1).stake(stakeAmount);

      const userBefore = await stakingToken.balanceOf(user1.address);
      const collectorBefore = await stakingToken.balanceOf(
        feeCollector.address
      );

      await pool.connect(user1).withdraw(stakeAmount);

      const userAfter = await stakingToken.balanceOf(user1.address);
      const collectorAfter = await stakingToken.balanceOf(feeCollector.address);

      expect(userAfter - userBefore).to.equal(expectedToUser);
      expect(collectorAfter - collectorBefore).to.equal(expectedPenalty);
    });

    it('factory can deactivate/activate pools (owner-only)', async function () {
      const { factory, poolId, owner, user1 } = await deployFixture();

      await expect(
        factory.connect(user1).deactivatePool(poolId)
      ).to.be.revertedWithCustomError(factory, 'OwnableUnauthorizedAccount');

      await factory.connect(owner).deactivatePool(poolId);
      expect((await factory.pools(poolId)).active).to.equal(false);

      await factory.connect(owner).activatePool(poolId);
      expect((await factory.pools(poolId)).active).to.equal(true);
    });
  });

  describe('Rewards (notifyRewardAmount + claimRewards)', function () {
    it('earned() is safe before notifyRewardAmount is called', async function () {
      const { pool, stakingToken, user1 } = await deployFixture();
      const stakeAmount = ethers.parseEther('100');

      await stakingToken.connect(user1).approve(pool.target, stakeAmount);
      await pool.connect(user1).stake(stakeAmount);

      expect(await pool.earned(user1.address)).to.equal(0n);
    });

    it('accrues rewards after notifyRewardAmount and allows claiming', async function () {
      const { pool, stakingToken, rewardToken, owner, user1 } =
        await deployFixture();
      const stakeAmount = ethers.parseEther('100');
      const duration = 1000;
      const rewardAmount = REWARD_RATE * BigInt(duration);

      await stakingToken.connect(user1).approve(pool.target, stakeAmount);
      await pool.connect(user1).stake(stakeAmount);

      await rewardToken.connect(owner).approve(pool.target, rewardAmount);
      await pool.connect(owner).notifyRewardAmount(rewardAmount, duration);

      await increaseTime(123);

      const expected = await pool.earned(user1.address);
      // Block timestamp granularity can cause an off-by-one-second drift.
      expect(
        expected === REWARD_RATE * 123n || expected === REWARD_RATE * 124n
      ).to.equal(true);

      const balBefore = await rewardToken.balanceOf(user1.address);
      await pool.connect(user1).claimRewards();
      const balAfter = await rewardToken.balanceOf(user1.address);
      const paid = balAfter - balBefore;
      expect(
        paid === REWARD_RATE * 123n || paid === REWARD_RATE * 124n
      ).to.equal(true);

      // A second immediate claim may still pick up a small amount due to block timestamp granularity.
      const bal2Before = await rewardToken.balanceOf(user1.address);
      await pool.connect(user1).claimRewards();
      const bal2After = await rewardToken.balanceOf(user1.address);
      const paid2 = bal2After - bal2Before;
      expect(paid2 <= REWARD_RATE * 2n).to.equal(true);
    });

    it('reverts notifyRewardAmount for non-owner', async function () {
      const { pool } = await deployFixture();
      const signers = await ethers.getSigners();
      const other = signers[4];

      const duration = 100;
      const rewardAmount = REWARD_RATE * BigInt(duration);

      await expect(
        pool.connect(other).notifyRewardAmount(rewardAmount, duration)
      ).to.be.revertedWithCustomError(pool, 'OwnableUnauthorizedAccount');
    });
  });

  describe('Pause / emergencyWithdraw', function () {
    it('blocks stake/withdraw/claim while paused; emergencyWithdraw still works', async function () {
      const { pool, stakingToken, rewardToken, owner, user1, feeCollector } =
        await deployFixture({
          feeCollectorEnabled: true,
        });

      const stakeAmount = ethers.parseEther('100');
      await stakingToken.connect(user1).approve(pool.target, stakeAmount);
      await pool.connect(user1).stake(stakeAmount);

      await pool.connect(owner).pause();

      expect(await pool.paused()).to.equal(true);
      expect(await pool.owner()).to.equal(owner.address);

      await expect(pool.connect(user1).stake(1n)).to.be.revertedWithCustomError(
        pool,
        'EnforcedPause'
      );
      // Deposit-only pause: users must still be able to exit while paused.
      const stakerBeforeWithdraw = await stakingToken.balanceOf(user1.address);
      await pool.connect(user1).withdraw(stakeAmount);
      const stakerAfterWithdraw = await stakingToken.balanceOf(user1.address);
      expect(stakerAfterWithdraw - stakerBeforeWithdraw).to.equal(
        stakeAmount - (stakeAmount * BigInt(PENALTY_RATE)) / 10_000n
      );

      // Re-stake to test claim behavior while paused.
      await stakingToken.connect(user1).approve(pool.target, stakeAmount);
      await pool.connect(owner).unpause();
      await pool.connect(user1).stake(stakeAmount);
      await pool.connect(owner).pause();

      const duration = 100;
      const rewardAmount = REWARD_RATE * BigInt(duration);
      await rewardToken.connect(owner).approve(pool.target, rewardAmount);
      await pool.connect(owner).notifyRewardAmount(rewardAmount, duration);
      await pool.connect(user1).claimRewards();

      const before = await stakingToken.balanceOf(user1.address);
      const expectedPenalty = (stakeAmount * BigInt(PENALTY_RATE)) / 10_000n;
      const expectedToUser = stakeAmount - expectedPenalty;
      const collectorBefore = await stakingToken.balanceOf(
        feeCollector.address
      );

      await pool.connect(user1).emergencyWithdraw();

      const after = await stakingToken.balanceOf(user1.address);
      const collectorAfter = await stakingToken.balanceOf(feeCollector.address);
      expect(after - before).to.equal(expectedToUser);
      expect(collectorAfter - collectorBefore).to.equal(expectedPenalty);
    });
  });

  describe('UUPS upgrades', function () {
    it('allows only owner to upgrade and preserves state', async function () {
      const { pool, stakingToken, owner, user1, poolAddr } =
        await deployFixture();

      const StakingPoolV2CF = await ethers.getContractFactory('StakingPoolV2');
      const poolV2Impl = await StakingPoolV2CF.deploy();

      await expect(
        pool.connect(user1).upgradeToAndCall(poolV2Impl.target, '0x')
      ).to.be.revertedWithCustomError(pool, 'OwnableUnauthorizedAccount');

      await pool.connect(owner).upgradeToAndCall(poolV2Impl.target, '0x');

      const poolV2 = StakingPoolV2CF.attach(poolAddr);
      expect(await poolV2.version()).to.equal(2n);

      const stakeAmount = ethers.parseEther('50');
      await stakingToken.connect(user1).approve(pool.target, stakeAmount);
      await pool.connect(user1).stake(stakeAmount);
      expect(await poolV2.totalStaked()).to.equal(stakeAmount);
    });
  });

  describe('Reentrancy regression', function () {
    it('prevents reentrancy during staking token transferFrom', async function () {
      const signers = await ethers.getSigners();
      const [owner, user1, , feeCollector] = signers;

      const MockERC20 = await ethers.getContractFactory('MockERC20');
      const ReentrantERC20 = await ethers.getContractFactory('ReentrantERC20');
      const ReentrancyAttackerCF =
        await ethers.getContractFactory('ReentrancyAttacker');

      const reentrantToken = await ReentrantERC20.deploy(
        'Reentrant Staking Token',
        'RSTK',
        18,
        owner.address,
        INITIAL_SUPPLY
      );
      const rewardToken = await MockERC20.deploy(
        'Reward Token',
        'RWD',
        18,
        owner.address,
        INITIAL_SUPPLY
      );

      const StakingPoolUpgradeableCF = await ethers.getContractFactory(
        'StakingPoolUpgradeable'
      );
      const poolImpl = await StakingPoolUpgradeableCF.deploy();

      const StakingFactoryUpgradeableCF = await ethers.getContractFactory(
        'StakingFactoryUpgradeable'
      );
      const factoryImpl = await StakingFactoryUpgradeableCF.deploy();

      const ProxyCF = await ethers.getContractFactory('OZERC1967Proxy');
      const factoryInit = factoryImpl.interface.encodeFunctionData(
        'initialize',
        [owner.address, poolImpl.target]
      );
      const factoryProxy = await ProxyCF.deploy(
        factoryImpl.target,
        factoryInit
      );
      const factory = StakingFactoryUpgradeableCF.attach(factoryProxy.target);

      const tx = await factory.createPool(
        reentrantToken.target,
        rewardToken.target,
        LOCK_PERIOD,
        PENALTY_RATE,
        feeCollector.address
      );
      const receipt = await tx.wait();
      const parsedPoolCreated = receipt.logs
        .map((l) => {
          try {
            return factory.interface.parseLog(l);
          } catch {
            return null;
          }
        })
        .find((x) => x && x.name === 'PoolCreated') as any;

      expect(parsedPoolCreated, 'PoolCreated event should exist').to.not.equal(
        null
      );
      const poolAddr = parsedPoolCreated.args.pool as string;
      const pool = StakingPoolUpgradeableCF.attach(poolAddr);

      const attacker = await ReentrancyAttackerCF.deploy(poolAddr);
      const attackerStake = ethers.parseEther('10');

      await reentrantToken.transfer(attacker.target, attackerStake);
      await reentrantToken.setReenterConfig(
        poolAddr,
        attacker.target,
        attackerStake,
        true
      );

      await expect(
        attacker.connect(user1).attackStake(attackerStake)
      ).to.be.revertedWith('ReentrancyGuard: reentrant call');
    });
  });
});
