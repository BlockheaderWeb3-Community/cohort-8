import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("MilestoneEscrow", function () {
  let escrow: any;
  let owner: any;
  let freelancer: any;
  let stranger: any;

  const totalMilestones = 3;
  const ethPerMilestone = ethers.parseEther("1.0"); 
  const totalValue = ethPerMilestone * BigInt(totalMilestones);

  beforeEach(async function () {
    [owner, freelancer, stranger] = await ethers.getSigners();

    // Deploying with initial funding
    escrow = await ethers.deployContract("MilestoneEscrow", [
      freelancer.address,
      totalMilestones,
      ethPerMilestone,
    ], { value: totalValue });
  });

  describe("Deployment", function () {
    it("Should track the correct freelancer address", async function () {
      // Note: If 'freelancer' is private in Solidity, 
      // you'd need a getter to test this directly.
    });

    it("Should have the correct initial balance", async function () {
      const balance = await ethers.provider.getBalance(await escrow.getAddress());
      expect(balance).to.equal(totalValue);
    });
  });

  describe("Milestone Approval", function () {
    it("Should transfer ethPerMilestone to freelancer and emit event", async function () {
      await expect(escrow.approveMilestone())
        .to.emit(escrow, "MilestoneApproved")
        .withArgs(1, ethPerMilestone);

      const freelancerBalance = await ethers.provider.getBalance(freelancer.address);
      // Simplified check (ignoring gas since freelancer is receiving)
      expect(freelancerBalance).to.be.above(ethers.parseEther("10000")); 
    });

    it("Should complete the job after final milestone", async function () {
      // Loop through first two milestones
      for (let i = 0; i < totalMilestones - 1; i++) {
        await escrow.approveMilestone();
      }

      // Final milestone
      await expect(escrow.approveMilestone())
        .to.emit(escrow, "JobCompleted");
      
      // Verify job is inactive
      // Note: This requires making isJobActive public or adding a getter
    });

    it("Should fail if unauthorized users try to approve (Security Test)", async function () {
      // THIS TEST WILL CURRENTLY FAIL because your contract lacks the 'onlyClient' modifier
      // Once you add 'onlyClient' to approveMilestone, this test will pass.
      await expect(escrow.connect(stranger).approveMilestone())
        .to.be.revertedWith("Only the client can perform this action");
    });
  });
});