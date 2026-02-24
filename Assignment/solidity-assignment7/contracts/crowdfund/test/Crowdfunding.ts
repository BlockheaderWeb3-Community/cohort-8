import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("SimpleCrowdfunding", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const testClient = await viem.getTestClient();
  const [owner, contributor] = await viem.getWalletClients();

  async function deployCrowdfunding(goal: bigint, deadline: bigint) {
    return viem.deployContract("SimpleCrowdfunding", [goal, deadline], {
      client: { wallet: owner, public: publicClient },
    });
  }

  it("allows owner withdrawal when goal is met", async function () {
    const block = await publicClient.getBlock();
    const deadline = BigInt(block.timestamp) + 3600n;
    const contract = await deployCrowdfunding(5n, deadline);

    const asContributor = await viem.getContractAt(
      "SimpleCrowdfunding",
      contract.address,
      { client: { wallet: contributor, public: publicClient } },
    );

    await asContributor.write.contribute({ value: 5n });
    await contract.write.withdraw();
    assert.equal(await contract.read.withdrawn(), true);
  });

  it("allows refunds after deadline when goal not met", async function () {
    const block = await publicClient.getBlock();
    const deadline = BigInt(block.timestamp) + 3600n;
    const contract = await deployCrowdfunding(10n, deadline);

    const asContributor = await viem.getContractAt(
      "SimpleCrowdfunding",
      contract.address,
      { client: { wallet: contributor, public: publicClient } },
    );

    await asContributor.write.contribute({ value: 5n });

    await testClient.increaseTime({ seconds: 3600 });
    await testClient.mine({ blocks: 1 });

    await asContributor.write.refund();
    const refunded = await contract.read.contributions([contributor.account.address]);
    assert.equal(refunded, 0n);

    await assert.rejects(async () => {
      await asContributor.write.refund();
    });
  });
});
