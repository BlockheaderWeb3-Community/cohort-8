import { expect } from "chai";
import { network } from "hardhat";
const { networkHelpers } = await network.connect();

const { ethers } = await network.connect();

describe("Milestone Contract", function () {
  let milestone: any;
  let client: any;
  let freelancer: any;
  let other: any;

  const milestones = 3;
  const ethPerMilestone = ethers.parseEther("1");

  beforeEach(async function () {
    [client, freelancer, other] = await ethers.getSigners();

    const Milestone = await ethers.getContractFactory("Milestone");
    milestone = await Milestone.deploy();
    await milestone.waitForDeployment();
  });

  describe("createJob", function () {
    it("Should create a job correctly when fully funded", async function () {
      const totalFunding = ethPerMilestone * BigInt(milestones);

      await milestone
        .connect(client)
        .createJob(freelancer.address, milestones, ethPerMilestone, {
          value: totalFunding,
        });

      const job = await milestone.jobs(1);

      expect(job.client).to.equal(client.address);
      expect(job.freelancer).to.equal(freelancer.address);
      expect(job.milestonesTotal).to.equal(milestones);
      expect(job.milestonesDone).to.equal(0);
      expect(job.status).to.equal(0);
    });

    it("Should revert if not fully funded", async function () {
      await expect(
        milestone
          .connect(client)
          .createJob(freelancer.address, milestones, ethPerMilestone, {
            value: ethPerMilestone,
          }),
      ).to.be.revertedWith("Must fund full contract upfront");
    });
  });

  describe("tickMilestone", function () {
    beforeEach(async function () {
      const totalFunding = ethPerMilestone * BigInt(milestones);

      await milestone
        .connect(client)
        .createJob(freelancer.address, milestones, ethPerMilestone, {
          value: totalFunding,
        });
    });

    it("Freelancer can tick milestone", async function () {
      await milestone.connect(freelancer).tickMilestone(1);

      const job = await milestone.jobs(1);
      expect(job.milestonesDone).to.equal(1);
    });

    it("Should revert if not freelancer", async function () {
      await expect(
        milestone.connect(other).tickMilestone(1),
      ).to.be.revertedWith("Only freelancer can mark milestone");
    });
  });

  describe("confirmMilestone", function () {
    beforeEach(async function () {
      const totalFunding = ethPerMilestone * BigInt(milestones);

      await milestone
        .connect(client)
        .createJob(freelancer.address, milestones, ethPerMilestone, {
          value: totalFunding,
        });

      await milestone.connect(freelancer).tickMilestone(1);
    });

    it("Client confirms and transfers ETH", async function () {
      const beforeBalance = await ethers.provider.getBalance(
        freelancer.address,
      );

      const tx = await milestone.connect(client).confirmMilestone(1);
      await tx.wait();

      const afterBalance = await ethers.provider.getBalance(freelancer.address);

      expect(afterBalance).to.be.gt(beforeBalance);
    });

    it("Should revert if not client", async function () {
      await expect(
        milestone.connect(other).confirmMilestone(1),
      ).to.be.revertedWith("Only client can confirm");
    });
  });
});
