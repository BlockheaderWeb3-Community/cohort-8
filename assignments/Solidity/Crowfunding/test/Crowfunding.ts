import { expect } from "chai";
import { ethers } from "ethers";
import { network } from "hardhat";

describe("Crowdfunding", function () {
  let crowdfunding: any;
  let owner: any;
  let alice: any;
  let bob: any;
  let provider: any;

  const targetAmount = ethers.parseEther("10"); // 10 ETH
  const duration = 3600; // 1 hour

  beforeEach(async function () {
    const hethers = (await network.connect()).ethers;
    provider = hethers.provider;
    const signers = await hethers.getSigners();
    [owner, alice, bob] = signers;
    const CrowdfundingFactory = await hethers.getContractFactory("Crowdfunding");
    crowdfunding = await CrowdfundingFactory.deploy(targetAmount, duration);
  });

  describe("Contributions", function () {
    it("Should allow users to contribute", async function () {
      const amount = ethers.parseEther("1");
      await expect(crowdfunding.connect(alice).contribute(amount, { value: amount }))
        .to.emit(crowdfunding, "Contributed")
        .withArgs(alice.address, amount);

      expect(await crowdfunding.totalRaised()).to.equal(amount);
      expect(await crowdfunding.contributions(alice.address)).to.equal(amount);
    });

    it("Should fail if amount argument does not match sent ETH", async function () {
      const amount = ethers.parseEther("1");
      await expect(
        crowdfunding.connect(alice).contribute(amount, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Sent ETH does not match _amount argument");
    });
  });

  describe("Withdrawals (Success Case)", function () {
    it("Should allow owner to withdraw if target is reached after deadline", async function () {
      // Alice contributes 10 ETH
      await crowdfunding.connect(alice).contribute(targetAmount, { value: targetAmount });

      // Warp time to after the deadline
      await provider.send("hardhat_mine", ["0x1"]);

      const initialOwnerBalance = await provider.getBalance(owner.address);
      
      const tx = await crowdfunding.withdrawFunds();
      const receipt = await tx.wait();
      
      // Calculate gas spent by owner to get exact math
      const gasSpent = receipt.gasUsed * receipt.gasPrice;

      const finalOwnerBalance = await provider.getBalance(owner.address);
      
      expect(finalOwnerBalance).to.equal(initialOwnerBalance + targetAmount - gasSpent);
      await expect(tx).to.emit(crowdfunding, "GoalReached").withArgs(targetAmount);
    });
  });

  describe("Refunds (Failure Case)", function () {
    it("Should allow contributors to claim refunds if target is not met", async function () {
      const smallAmount = ethers.parseEther("2");
      await crowdfunding.connect(alice).contribute(smallAmount, { value: smallAmount });

      // Warp time to after deadline
      await provider.send("hardhat_mine", ["0x1"]);

      // Alice claims refund
      await expect(crowdfunding.connect(alice).refundButtom())
        .to.emit(crowdfunding, "RefundClaimed")
        .withArgs(alice.address, smallAmount);

      expect(await crowdfunding.contributions(alice.address)).to.equal(0);
    });

    it("Should prevent refunds if deadline has not passed", async function () {
      await expect(crowdfunding.connect(alice).refundButtom())
        .to.be.revertedWith("Deadline has not reached");
    });
  });
});
