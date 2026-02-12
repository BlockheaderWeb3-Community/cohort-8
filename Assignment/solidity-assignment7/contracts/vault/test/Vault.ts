import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("TimelockedSavingsVault", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const testClient = await viem.getTestClient();
  const [user] = await viem.getWalletClients();

  async function deployVault() {
    return viem.deployContract("TimelockedSavingsVault", [], {
      client: { wallet: user, public: publicClient },
    });
  }

  it("locks for 24 hours and allows withdrawal after", async function () {
    const vault = await deployVault();
    const block = await publicClient.getBlock();
    const depositTime = BigInt(block.timestamp) + 1n;
    await testClient.setNextBlockTimestamp({ timestamp: depositTime });
    const unlockTime = depositTime + 24n * 60n * 60n;

    await vault.write.deposit([unlockTime], { value: 1n });

    await assert.rejects(async () => {
      await vault.write.withdraw();
    });

    await testClient.increaseTime({ seconds: 24 * 60 * 60 });
    await testClient.mine({ blocks: 1 });

    await vault.write.withdraw();
    const v = await vault.read.getVault([user.account.address]);
    assert.equal(v[0], 0n);
    assert.equal(v[2], false);
  });

  it("rejects double deposit", async function () {
    const vault = await deployVault();
    const block = await publicClient.getBlock();
    const depositTime = BigInt(block.timestamp) + 1n;
    await testClient.setNextBlockTimestamp({ timestamp: depositTime });
    const unlockTime = depositTime + 24n * 60n * 60n;

    await vault.write.deposit([unlockTime], { value: 1n });

    await assert.rejects(async () => {
      await vault.write.deposit([unlockTime], { value: 1n });
    });
  });

  it("rejects unlock time in the past", async function () {
    const vault = await deployVault();
    const block = await publicClient.getBlock();
    const past = BigInt(block.timestamp) - 1n;

    await assert.rejects(async () => {
      await vault.write.deposit([past], { value: 1n });
    });
  });

  it("rejects early withdrawal", async function () {
    const vault = await deployVault();
    const block = await publicClient.getBlock();
    const depositTime = BigInt(block.timestamp) + 1n;
    await testClient.setNextBlockTimestamp({ timestamp: depositTime });
    const unlockTime = depositTime + 24n * 60n * 60n;

    await vault.write.deposit([unlockTime], { value: 1n });

    await assert.rejects(async () => {
      await vault.write.withdraw();
    });
  });

  it("rejects double withdrawal", async function () {
    const vault = await deployVault();
    const block = await publicClient.getBlock();
    const depositTime = BigInt(block.timestamp) + 1n;
    await testClient.setNextBlockTimestamp({ timestamp: depositTime });
    const unlockTime = depositTime + 24n * 60n * 60n;

    await vault.write.deposit([unlockTime], { value: 1n });
    await testClient.increaseTime({ seconds: 24 * 60 * 60 });
    await testClient.mine({ blocks: 1 });
    await vault.write.withdraw();

    await assert.rejects(async () => {
      await vault.write.withdraw();
    });
  });

  it("rejects direct ETH transfers", async function () {
    const vault = await deployVault();

    await assert.rejects(async () => {
      await user.sendTransaction({
        to: vault.address,
        value: 1n,
      });
    });
  });
});
