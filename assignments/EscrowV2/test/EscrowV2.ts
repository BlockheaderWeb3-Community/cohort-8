import { expect } from "chai";
import { network } from "hardhat";

// Hardhat v3 uses ESM; connect to the in-process network to access ethers.
const { ethers } = await network.connect();

describe("EscrowV2", function () {
  // Deploys a funded EscrowV2 instance with 3 milestones of 1 ETH each.
  async function deployFixture() {
    const [client, freelancer, other] = await ethers.getSigners();
    const totalMilestones = 3n;
    const ethPerMilestone = ethers.parseEther("1");
    const totalFunded = totalMilestones * ethPerMilestone;

    // Deploy from the client account to lock in role permissions.
    const EscrowV2 = await ethers.getContractFactory("EscrowV2", client);
    const escrow = await EscrowV2.deploy(
      freelancer.address,
      totalMilestones,
      ethPerMilestone,
      { value: totalFunded }
    );

    return { escrow, client, freelancer, other, totalMilestones, ethPerMilestone, totalFunded };
  }

  it("creates a funded job and stores core parameters", async function () {
    const { escrow, client, freelancer, totalMilestones, ethPerMilestone, totalFunded } =
      await deployFixture();

    expect(await escrow.client()).to.equal(client.address);
    expect(await escrow.freelancer()).to.equal(freelancer.address);
    expect(await escrow.totalMilestones()).to.equal(totalMilestones);
    expect(await escrow.ethPerMilestone()).to.equal(ethPerMilestone);
    expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(totalFunded);
  });

  it("allows the freelancer to mark a milestone as completed", async function () {
    const { escrow, freelancer } = await deployFixture();

    await expect(escrow.connect(freelancer).markCompleted(0))
      .to.emit(escrow, "MilestoneCompleted")
      .withArgs(0);
  });

  it("prevents anyone other than the freelancer from marking completion", async function () {
    const { escrow, other } = await deployFixture();

    await expect(escrow.connect(other).markCompleted(0)).to.be.revertedWithCustomError(
      escrow,
      "OnlyFreelancer"
    );
  });

  it("requires completion before the client can approve", async function () {
    const { escrow, client } = await deployFixture();

    await expect(escrow.connect(client).approveMilestone(0)).to.be.revertedWithCustomError(
      escrow,
      "NotCompleted"
    );
  });

  it("releases payment when the client approves a completed milestone", async function () {
    const { escrow, client, freelancer, ethPerMilestone } = await deployFixture();

    // Sequence mirrors real workflow: freelancer completes, client approves.
    await escrow.connect(freelancer).markCompleted(1);

    // Balance delta verifies the exact payout amount.
    const freelancerBalanceBefore = await ethers.provider.getBalance(freelancer.address);
    const tx = await escrow.connect(client).approveMilestone(1);
    await tx.wait();

    const freelancerBalanceAfter = await ethers.provider.getBalance(freelancer.address);
    expect(freelancerBalanceAfter - freelancerBalanceBefore).to.equal(ethPerMilestone);
  });

  it("prevents double-approval of the same milestone", async function () {
    const { escrow, client, freelancer } = await deployFixture();

    // Approving twice must revert to prevent double payment.
    await escrow.connect(freelancer).markCompleted(2);
    await escrow.connect(client).approveMilestone(2);

    await expect(escrow.connect(client).approveMilestone(2)).to.be.revertedWithCustomError(
      escrow,
      "AlreadyApproved"
    );
  });

  it("marks the job complete after the final approval", async function () {
    const { escrow, client, freelancer } = await deployFixture();

    await escrow.connect(freelancer).markCompleted(0);
    await escrow.connect(freelancer).markCompleted(1);
    await escrow.connect(freelancer).markCompleted(2);

    await escrow.connect(client).approveMilestone(0);
    await escrow.connect(client).approveMilestone(1);

    await expect(escrow.connect(client).approveMilestone(2))
      .to.emit(escrow, "JobCompleted")
      .withArgs(ethers.parseEther("3"));

    expect(await escrow.isComplete()).to.equal(true);
  });
});
