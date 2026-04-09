import { expect } from "chai";
import { network } from "hardhat";

describe("Milestone Contract", function () {
  let ethers: any;
  let networkHelpers: any;

  before(async () => {
    // Connect to Hardhat 3 network
    const connection = await network.connect();
    ethers = connection.ethers;
    networkHelpers = connection.networkHelpers;
  });

  // Fixture to deploy the Milestone contract
  async function deployMilestoneFixture() {
    const [client, freelancer, otherAccount] = await ethers.getSigners();
    const amount = ethers.parseEther("1"); // 1 ETH

    const Milestone = await ethers.getContractFactory("Milestone");
    const milestone = await Milestone.deploy(freelancer.address);

    return { milestone, client, freelancer, otherAccount, amount };
  }

  describe("Workflow", function () {
    it("Should complete the full happy path", async function () {
      const { milestone, client, freelancer, amount } =
        await networkHelpers.loadFixture(deployMilestoneFixture);

      // 1. Fund the contract
      await expect(milestone.connect(client).fundContract({ value: amount }))
        .to.emit(milestone, "JobCreated")
        .withArgs(freelancer.address, amount);

      // 2. Confirm funding
      await milestone.connect(client).confirmFunding();
      expect(await milestone.status()).to.equal(1); // FUNDING_CONFIRMED

      // 3. Approve milestone
      await milestone.connect(client).approveMilestone();
      expect(await milestone.status()).to.equal(2); // MILESTONE_APPROVED

      // 4. Release funds to freelancer
      const initialBalance = await ethers.provider.getBalance(
        freelancer.address,
      ); // bigint

      const tx = await milestone.connect(client).releaseFunds();
      await expect(tx)
        .to.emit(milestone, "FundsReleased")
        .withArgs(freelancer.address, amount);

      const finalBalance = await ethers.provider.getBalance(freelancer.address);

      expect(finalBalance).to.equal(initialBalance + amount); // bigint arithmetic
      expect(await milestone.status()).to.equal(3); // COMPLETED
    });

    it("Should allow client to refund before approval", async function () {
      const { milestone, client, amount } = await networkHelpers.loadFixture(
        deployMilestoneFixture,
      );

      await milestone.connect(client).fundContract({ value: amount });
    });
  });

  describe.only("Security & Constraints", function () {
    it("Should revert if non-client tries to release funds", async function () {
      const { milestone, freelancer, amount, client } =
        await networkHelpers.loadFixture(deployMilestoneFixture);

      await milestone.connect(client).fundContract({ value: amount });
      await milestone.connect(client).confirmFunding();
      await milestone.connect(client).approveMilestone();

      await expect(
        milestone.connect(freelancer).releaseFunds(),
      ).to.be.revertedWith("Only client allowed");
    });

    it("Should not allow refund after milestone is approved", async function () {
      const { milestone, client, amount } = await networkHelpers.loadFixture(
        deployMilestoneFixture,
      );

      await milestone.connect(client).fundContract({ value: amount });
      await milestone.connect(client).confirmFunding();
      await milestone.connect(client).approveMilestone();

      await expect(milestone.connect(client).refundClient()).to.be.revertedWith(
        "cannot refund after approval",
      );
    });

    it("Should revert if trying to approve milestone before confirming funding", async function () {
      const { milestone, client, amount } = await networkHelpers.loadFixture(
        deployMilestoneFixture,
      );

      await milestone.connect(client).fundContract({ value: amount });

      await expect(
        milestone.connect(client).approveMilestone(),
      ).to.be.revertedWith("Funding not confirmed yet");
    });

    it("Should revert if trying to release funds before milestone approval", async function () {
      const { milestone, client, amount } = await networkHelpers.loadFixture(
        deployMilestoneFixture,
      );

      await milestone.connect(client).fundContract({ value: amount });
      await milestone.connect(client).confirmFunding();

      await expect(milestone.connect(client).releaseFunds()).to.be.revertedWith(
        "Milestone not approved yet",
      );
    });
  });
});
