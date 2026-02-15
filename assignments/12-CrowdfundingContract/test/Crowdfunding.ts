import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

describe("Crowdfunding", function () {
  let crowdfunding: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const GOAL = ethers.parseEther("10");
  const DURATION = 60 * 60; // 1 hour

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    crowdfunding = await ethers.deployContract("Crowdfunding", [
      GOAL,
      DURATION,
    ]);
  });

  it("Should set correct constructor values", async () => {
    expect(await crowdfunding.owner()).to.equal(owner.address);
    expect(await crowdfunding.goal()).to.equal(GOAL);
    expect(await crowdfunding.totalRaised()).to.equal(0);
    expect(await crowdfunding.withdrawn()).to.equal(false);
  });

  it("Should accept valid contributions", async () => {
    const amount = ethers.parseEther("1");

    await crowdfunding.connect(addr1).contribute({ value: amount });

    expect(await crowdfunding.totalRaised()).to.equal(amount);
    expect(await crowdfunding.contributions(addr1.address)).to.equal(amount);
  });

  it("Should reject zero contribution", async () => {
    await expect(
      crowdfunding.connect(addr1).contribute({ value: 0 }),
    ).to.be.revertedWith("Contribution must be > 0");
  });

  it("Should reject contributions after deadline", async () => {
    await networkHelpers.time.increase(DURATION + 1);

    await expect(
      crowdfunding.connect(addr1).contribute({
        value: ethers.parseEther("1"),
      }),
    ).to.be.revertedWith("Deadline passed");
  });

  it("Should not allow withdraw before deadline", async () => {
    await expect(crowdfunding.withdraw()).to.be.revertedWith(
      "Deadline not yet reached",
    );
  });

  it("Should not allow non-owner to withdraw", async () => {
    await networkHelpers.time.increase(DURATION + 1);

    await expect(crowdfunding.connect(addr1).withdraw()).to.be.revertedWith(
      "Not owner",
    );
  });

  it("Should not withdraw if goal not met", async () => {
    await crowdfunding.connect(addr1).contribute({
      value: ethers.parseEther("1"),
    });

    await networkHelpers.time.increase(DURATION + 1);

    await expect(crowdfunding.withdraw()).to.be.revertedWith("Goal not met");
  });

  it("Should prevent double withdrawal", async () => {
    const amount = ethers.parseEther("10");

    await crowdfunding.connect(addr1).contribute({ value: amount });

    await networkHelpers.time.increase(DURATION + 1);

    await crowdfunding.withdraw();

    await expect(crowdfunding.withdraw()).to.be.revertedWith(
      "Already withdrawn",
    );
  });

  it("Should prevent refund if goal met", async () => {
    await crowdfunding.connect(addr1).contribute({
      value: ethers.parseEther("10"),
    });

    await networkHelpers.time.increase(DURATION + 1);

    await expect(crowdfunding.connect(addr1).refund()).to.be.revertedWith(
      "Goal was met",
    );
  });

  it("Should prevent refund before deadline", async () => {
    await crowdfunding.connect(addr1).contribute({
      value: ethers.parseEther("1"),
    });

    await expect(crowdfunding.connect(addr1).refund()).to.be.revertedWith(
      "Deadline not yet reached",
    );
  });

  it("Should prevent double refund", async () => {
    const amount = ethers.parseEther("1");

    await crowdfunding.connect(addr1).contribute({ value: amount });

    await networkHelpers.time.increase(DURATION + 1);

    await crowdfunding.connect(addr1).refund();

    await expect(crowdfunding.connect(addr1).refund()).to.be.revertedWith(
      "No funds to refund",
    );
  });

  it("Should revert refund if user never contributed", async () => {
    await networkHelpers.time.increase(DURATION + 1);

    await expect(crowdfunding.connect(addr1).refund()).to.be.revertedWith(
      "No funds to refund",
    );
  });
});
