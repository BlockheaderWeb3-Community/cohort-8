import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("MilestoneEscrow", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [client, freelancer] = await viem.getWalletClients();

  async function deployEscrow() {
    return viem.deployContract("MilestoneEscrow", [], {
      client: { wallet: client, public: publicClient },
    });
  }

  it("creates, funds, completes and pays milestones", async function () {
    const escrow = await deployEscrow();
    const deploymentBlock = await publicClient.getBlockNumber();

    await escrow.write.createJob([
      freelancer.account.address,
      2n,
      1n,
    ]);

    const events = await publicClient.getContractEvents({
      address: escrow.address,
      abi: escrow.abi,
      eventName: "JobCreated",
      fromBlock: deploymentBlock,
      strict: true,
    });

    const jobId = events[0]?.args.jobId;
    assert.ok(jobId !== undefined);

    await escrow.write.fundJob([jobId], { value: 2n });

    const escrowAsFreelancer = await viem.getContractAt(
      "MilestoneEscrow",
      escrow.address,
      { client: { wallet: freelancer, public: publicClient } },
    );

    await escrowAsFreelancer.write.markCompleted([jobId, 0n]);
    await escrow.write.approveMilestone([jobId, 0n]);

    const status0 = await escrow.read.milestoneStatus([jobId, 0n]);
    assert.equal(status0[0], true);
    assert.equal(status0[1], true);

    await escrowAsFreelancer.write.markCompleted([jobId, 1n]);
    await escrow.write.approveMilestone([jobId, 1n]);

    const job = await escrow.read.getJob([jobId]);
    assert.equal(job[5], 2n);
  });

  it("prevents double approval", async function () {
    const escrow = await deployEscrow();
    const deploymentBlock = await publicClient.getBlockNumber();

    await escrow.write.createJob([
      freelancer.account.address,
      1n,
      1n,
    ]);

    const events = await publicClient.getContractEvents({
      address: escrow.address,
      abi: escrow.abi,
      eventName: "JobCreated",
      fromBlock: deploymentBlock,
      strict: true,
    });

    const jobId = events[0]?.args.jobId;
    assert.ok(jobId !== undefined);

    await escrow.write.fundJob([jobId], { value: 1n });

    const escrowAsFreelancer = await viem.getContractAt(
      "MilestoneEscrow",
      escrow.address,
      { client: { wallet: freelancer, public: publicClient } },
    );

    await escrowAsFreelancer.write.markCompleted([jobId, 0n]);
    await escrow.write.approveMilestone([jobId, 0n]);

    await assert.rejects(async () => {
      await escrow.write.approveMilestone([jobId, 0n]);
    });
  });
});
