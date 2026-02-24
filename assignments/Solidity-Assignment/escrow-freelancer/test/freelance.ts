import { expect } from "chai";
import { network } from "hardhat";

describe("FreeLance Contract (Hardhat v3)", function () {
  let client: any;
  let freelancer: any;
  let other: any;
  let publicClient: any;
  let freelance: any;

  const TOTAL_MILESTONES = 2n;
  const TOTAL_PAYMENT = 2n * 10n ** 18n; // 2 ETH

  beforeEach(async function () {
    const { viem } = await network.connect();

    // Get wallet clients (accounts)
    const wallets = await viem.getWalletClients();
    client = wallets[0];
    freelancer = wallets[1];
    other = wallets[2];

    publicClient = await viem.getPublicClient();

    // Deploy contract
    freelance = await viem.deployContract("FreeLance", [
      freelancer.account.address,
      TOTAL_MILESTONES,
    ], {
      value: TOTAL_PAYMENT,
      account: client.account,
    });
  });

  it("Should initialize correctly", async function () {
    expect(await freelance.read.client()).to.equal(client.account.address);
    expect(await freelance.read.freelancer()).to.equal(
      freelancer.account.address
    );
    expect(await freelance.read.totalMilestones()).to.equal(
      TOTAL_MILESTONES
    );

    const perMilestone = TOTAL_PAYMENT / TOTAL_MILESTONES;

    expect(await freelance.read.perMilestone()).to.equal(perMilestone);
  });

  it("Only freelancer can submit milestone", async function () {
    await expect(
      freelance.write.submit({
        account: other.account,
      })
    ).to.be.rejected;

    await freelance.write.submit({
      account: freelancer.account,
    });

    expect(await freelance.read.isSubmitted()).to.equal(true);
  });

  it("Client cannot approve without submission", async function () {
    await expect(
      freelance.write.approve({
        account: client.account,
      })
    ).to.be.rejected;
  });

  it("Should release payment per milestone", async function () {
    const perMilestone = await freelance.read.perMilestone();

    // Submit milestone
    await freelance.write.submit({
      account: freelancer.account,
    });

    const balanceBefore = await publicClient.getBalance({
      address: freelancer.account.address,
    });

    await freelance.write.approve({
      account: client.account,
    });

    const balanceAfter = await publicClient.getBalance({
      address: freelancer.account.address,
    });

    expect(balanceAfter - balanceBefore).to.equal(perMilestone);
    expect(await freelance.read.completed()).to.equal(1n);
  });

  it("Should send remaining balance on final milestone", async function () {
    // First milestone
    await freelance.write.submit({
      account: freelancer.account,
    });

    await freelance.write.approve({
      account: client.account,
    });

    // Second milestone
    await freelance.write.submit({
      account: freelancer.account,
    });

    const balanceBefore = await publicClient.getBalance({
      address: freelancer.account.address,
    });

    await freelance.write.approve({
      account: client.account,
    });

    const balanceAfter = await publicClient.getBalance({
      address: freelancer.account.address,
    });

    expect(await freelance.read.completed()).to.equal(2n);
    expect(balanceAfter > balanceBefore).to.equal(true);
  });

  it("Cannot submit after all milestones completed", async function () {
    // Complete both milestones
    await freelance.write.submit({ account: freelancer.account });
    await freelance.write.approve({ account: client.account });

    await freelance.write.submit({ account: freelancer.account });
    await freelance.write.approve({ account: client.account });

    await expect(
      freelance.write.submit({
        account: freelancer.account,
      })
    ).to.be.rejected;
  });
});
