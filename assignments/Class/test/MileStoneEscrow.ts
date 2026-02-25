import { expect } from "chai";
import { network } from "hardhat";
//import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
//import { time } from "@nomicfoundation/hardhat-network-helpers";
//import { MilestoneEscrow } from "../typechain-types";
//import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
const { ethers, networkHelpers } = await network.connect();
const { time, loadFixture } = networkHelpers;
// ─── Constants ──────────────────────────────────────────────────────────────
const AUTO_APPROVE_TIMEOUT = 14 * 24 * 60 * 60; // 14 days in seconds
const MILESTONE_COUNT = 3;
const AMOUNT_PER_MILESTONE = ethers.parseEther("1");
const TOTAL_AMOUNT = AMOUNT_PER_MILESTONE * BigInt(MILESTONE_COUNT);

// ─── Fixtures ────────────────────────────────────────────────────────────────
async function deployEscrowFixture() {
  const [, client, freelancer, stranger] = await ethers.getSigners();

  const factory = await ethers.getContractFactory("MilestoneEscrow", client);
  const escrow = (await factory.deploy(
    freelancer.address,
    MILESTONE_COUNT,
    AMOUNT_PER_MILESTONE,
    { value: TOTAL_AMOUNT }
  )) as unknown as any;

  await escrow.waitForDeployment();

  return { escrow, client, freelancer, stranger };
}

/** Deploys a single-milestone escrow for simpler tests */
async function deploySingleMilestoneFixture() {
  const [, client, freelancer] = await ethers.getSigners();
  const amount = ethers.parseEther("1");

  const factory = await ethers.getContractFactory("MilestoneEscrow", client);
  const escrow = (await factory.deploy(
    freelancer.address,
    1,
    amount,
    { value: amount }
  )) as unknown as any;

  await escrow.waitForDeployment();
  return { escrow, client, freelancer, amount };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function completeAndApprove(
  escrow: any,
  freelancer: any,
  client: any,
  id: number
) {
  await escrow.connect(freelancer).markCompleted(id);
  await escrow.connect(client).approveMilestone(id);
}

/** Manual balance-delta helper — avoids changeEtherBalance type issues */
async function getBalanceDelta(
  account: any,
  action: () => Promise<void>
): Promise<bigint> {
  const before = await ethers.provider.getBalance(account.address);
  await action();
  const after = await ethers.provider.getBalance(account.address);
  return after - before;
}

// ════════════════════════════════════════════════════════════════════════════
//  TEST SUITE
// ════════════════════════════════════════════════════════════════════════════
describe("MilestoneEscrow", () => {

  // ── Deployment ─────────────────────────────────────────────────────────────
  describe("Deployment", () => {
    it("sets client, freelancer, milestoneCount, amountPerMilestone correctly", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      expect(await escrow.client()).to.equal(client.address);
      expect(await escrow.freelancer()).to.equal(freelancer.address);
      expect(await escrow.milestoneCount()).to.equal(MILESTONE_COUNT);
      expect(await escrow.amountPerMilestone()).to.equal(AMOUNT_PER_MILESTONE);
    });

    it("holds the full escrow balance after deployment", async () => {
      const { escrow } = await loadFixture(deployEscrowFixture);
      expect(await escrow.getRemainingBalance()).to.equal(TOTAL_AMOUNT);
    });

    it("emits Funded event on deployment", async () => {
      const [, client, freelancer] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("MilestoneEscrow", client);

      // Deploy once, then inspect the deployment transaction
      const escrow = await factory.deploy(
        freelancer.address,
        MILESTONE_COUNT,
        AMOUNT_PER_MILESTONE,
        { value: TOTAL_AMOUNT }
      );
      await escrow.waitForDeployment();

      await expect(escrow.deploymentTransaction())
        .to.emit(escrow, "Funded")
        .withArgs(
          client.address,
          freelancer.address,
          TOTAL_AMOUNT,
          MILESTONE_COUNT,
          AMOUNT_PER_MILESTONE
        );
    });

    it("reverts when freelancer is zero address", async () => {
      const [, client] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("MilestoneEscrow", client);

      await expect(
        factory.deploy(ethers.ZeroAddress, 1, AMOUNT_PER_MILESTONE, {
          value: AMOUNT_PER_MILESTONE,
        })
      ).to.be.revertedWith("Invalid freelancer address");
    });

    it("reverts when client and freelancer are the same address", async () => {
      const [, client] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("MilestoneEscrow", client);

      await expect(
        factory.deploy(client.address, 1, AMOUNT_PER_MILESTONE, {
          value: AMOUNT_PER_MILESTONE,
        })
      ).to.be.revertedWith("Client cannot be freelancer");
    });

    it("reverts when milestoneCount is zero", async () => {
      const [, client, freelancer] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("MilestoneEscrow", client);

      await expect(
        factory.deploy(freelancer.address, 0, AMOUNT_PER_MILESTONE, {
          value: 0,
        })
      ).to.be.revertedWith("At least one milestone required");
    });

    it("reverts when amountPerMilestone is zero", async () => {
      const [, client, freelancer] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("MilestoneEscrow", client);

      await expect(
        factory.deploy(freelancer.address, 1, 0, { value: 0 })
      ).to.be.revertedWith("Amount per milestone must be > 0");
    });

    it("reverts when msg.value does not match expected deposit", async () => {
      const [, client, freelancer] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("MilestoneEscrow", client);

      await expect(
        factory.deploy(freelancer.address, 2, AMOUNT_PER_MILESTONE, {
          value: AMOUNT_PER_MILESTONE, // should be 2× but only sending 1×
        })
      ).to.be.revertedWith("Must fund all milestones");
    });
  });

  // ── markCompleted ──────────────────────────────────────────────────────────
  describe("markCompleted", () => {
    it("freelancer can mark a milestone complete", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);

      await escrow.connect(freelancer).markCompleted(0);
      expect(await escrow.completed(0)).to.be.true;
    });

    it("records the completion timestamp", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);
      const tx = await escrow.connect(freelancer).markCompleted(0);
      const block = await ethers.provider.getBlock(tx.blockNumber!);

      expect(await escrow.completionTime(0)).to.equal(block!.timestamp);
    });

    it("emits MilestoneCompleted event", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);

      await expect(escrow.connect(freelancer).markCompleted(0))
        .to.emit(escrow, "MilestoneCompleted")
        .withArgs(0, freelancer.address, (v: bigint) => v > 0n);
    });

    it("reverts when called by non-freelancer", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await expect(escrow.connect(client).markCompleted(0)).to.be.revertedWith(
        "Only freelancer can mark complete"
      );
    });

    it("reverts for out-of-range milestone id", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);

      await expect(
        escrow.connect(freelancer).markCompleted(MILESTONE_COUNT)
      ).to.be.revertedWith("Invalid milestone id");
    });

    it("reverts when already completed", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      await expect(escrow.connect(freelancer).markCompleted(0)).to.be.revertedWith(
        "Already marked as completed"
      );
    });

    it("reverts when contract is cancelled", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(client).cancel();

      await expect(escrow.connect(freelancer).markCompleted(0)).to.be.revertedWith(
        "Contract is cancelled"
      );
    });
  });

  // ── approveMilestone ───────────────────────────────────────────────────────
  describe("approveMilestone", () => {
    it("client can approve a completed milestone and freelancer receives funds", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      const delta = await getBalanceDelta(freelancer, async () => {
        await escrow.connect(client).approveMilestone(0);
      });

      expect(delta).to.equal(AMOUNT_PER_MILESTONE);
    });

    it("marks milestone as approved and increments counters", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).approveMilestone(0);

      expect(await escrow.approved(0)).to.be.true;
      expect(await escrow.approvedMilestones()).to.equal(1);
      expect(await escrow.releasedMilestones()).to.equal(1);
    });

    it("emits MilestoneApproved event", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      await expect(escrow.connect(client).approveMilestone(0))
        .to.emit(escrow, "MilestoneApproved")
        .withArgs(0, client.address, AMOUNT_PER_MILESTONE);
    });

    it("emits AllMilestonesReleased when last milestone is approved", async () => {
      const { escrow, client, freelancer } = await loadFixture(
        deploySingleMilestoneFixture
      );
      await escrow.connect(freelancer).markCompleted(0);

      await expect(escrow.connect(client).approveMilestone(0)).to.emit(
        escrow,
        "AllMilestonesReleased"
      );
    });

    it("reduces contract balance after approval", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).approveMilestone(0);

      expect(await escrow.getRemainingBalance()).to.equal(
        TOTAL_AMOUNT - AMOUNT_PER_MILESTONE
      );
    });

    it("reverts when milestone is not completed", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await expect(escrow.connect(client).approveMilestone(0)).to.be.revertedWith(
        "Milestone not completed yet"
      );
    });

    it("reverts when already approved", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).approveMilestone(0);

      await expect(escrow.connect(client).approveMilestone(0)).to.be.revertedWith(
        "Already approved"
      );
    });

    it("reverts for invalid milestone id", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await expect(
        escrow.connect(client).approveMilestone(999)
      ).to.be.revertedWith("Invalid milestone id");
    });

    it("reverts when contract is cancelled", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).cancel();

      await expect(escrow.connect(client).approveMilestone(0)).to.be.revertedWith(
        "Contract is cancelled"
      );
    });

    it("stranger can approve (no onlyClient guard — documents current behaviour)", async () => {
      const { escrow, freelancer, stranger } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      const delta = await getBalanceDelta(freelancer, async () => {
        await escrow.connect(stranger).approveMilestone(0);
      });

      expect(delta).to.equal(AMOUNT_PER_MILESTONE);
    });
  });

  // ── autoApprove ───────────────────────────────────────────────────────────
  describe("autoApprove", () => {
    it("reverts before the 14-day timeout", async () => {
      const { escrow, freelancer, stranger } = await loadFixture(deployEscrowFixture);
      const tx = await escrow.connect(freelancer).markCompleted(0);
      const block = await ethers.provider.getBlock(tx.blockNumber!);
      const completionTs = block!.timestamp;

      // Pin the autoApprove call to land exactly 1 second before the deadline
      await time.setNextBlockTimestamp(completionTs + AUTO_APPROVE_TIMEOUT - 1);

      await expect(escrow.connect(stranger).autoApprove(0)).to.be.revertedWith(
        "Timeout not reached yet"
      );
    });

    it("succeeds after the 14-day timeout and pays freelancer", async () => {
      const { escrow, freelancer, stranger } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      await time.increase(AUTO_APPROVE_TIMEOUT);

      const delta = await getBalanceDelta(freelancer, async () => {
        await escrow.connect(stranger).autoApprove(0);
      });

      expect(delta).to.equal(AMOUNT_PER_MILESTONE);
    });

    it("emits MilestoneAutoApproved and MilestoneApproved events", async () => {
      const { escrow, freelancer, stranger } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await time.increase(AUTO_APPROVE_TIMEOUT);

      const tx = escrow.connect(stranger).autoApprove(0);

      await expect(tx).to.emit(escrow, "MilestoneAutoApproved");
      await expect(tx)
        .to.emit(escrow, "MilestoneApproved")
        .withArgs(0, ethers.ZeroAddress, AMOUNT_PER_MILESTONE);
    });

    it("canAutoApprove returns false before timeout", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await time.increase(AUTO_APPROVE_TIMEOUT - 10);

      expect(await escrow.canAutoApprove(0)).to.be.false;
    });

    it("canAutoApprove returns true after timeout", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await time.increase(AUTO_APPROVE_TIMEOUT);

      expect(await escrow.canAutoApprove(0)).to.be.true;
    });

    it("canAutoApprove returns false if not completed", async () => {
      const { escrow } = await loadFixture(deployEscrowFixture);
      expect(await escrow.canAutoApprove(0)).to.be.false;
    });

    it("canAutoApprove returns false if already approved", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).approveMilestone(0);
      await time.increase(AUTO_APPROVE_TIMEOUT);

      expect(await escrow.canAutoApprove(0)).to.be.false;
    });

    it("canAutoApprove returns false for out-of-range id", async () => {
      const { escrow } = await loadFixture(deployEscrowFixture);
      expect(await escrow.canAutoApprove(999)).to.be.false;
    });

    it("reverts on autoApprove of already-approved milestone", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).approveMilestone(0);
      await time.increase(AUTO_APPROVE_TIMEOUT);

      await expect(escrow.connect(client).autoApprove(0)).to.be.revertedWith(
        "Already approved"
      );
    });
  });

  // ── cancel ─────────────────────────────────────────────────────────────────
  describe("cancel", () => {
    it("client can cancel and receives full refund (minus gas)", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      const delta = await getBalanceDelta(client, async () => {
        await escrow.connect(client).cancel();
      });

      // Client receives TOTAL_AMOUNT minus a small amount of gas
      expect(delta).to.be.gt(TOTAL_AMOUNT - ethers.parseEther("0.01"));
      expect(delta).to.be.lte(TOTAL_AMOUNT);
    });

    it("contract balance reaches zero after cancel", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);
      await escrow.connect(client).cancel();

      expect(await escrow.getRemainingBalance()).to.equal(0n);
    });

    it("sets cancelled flag to true", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);
      await escrow.connect(client).cancel();

      expect(await escrow.cancelled()).to.be.true;
    });

    it("emits ContractCancelled event with correct refund amount", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await expect(escrow.connect(client).cancel())
        .to.emit(escrow, "ContractCancelled")
        .withArgs(client.address, TOTAL_AMOUNT, (v: bigint) => v > 0n);
    });

    it("refunds only the remaining balance after partial payouts", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      // Approve one milestone first
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).approveMilestone(0);

      const remaining = TOTAL_AMOUNT - AMOUNT_PER_MILESTONE;

      await expect(escrow.connect(client).cancel())
        .to.emit(escrow, "ContractCancelled")
        .withArgs(client.address, remaining, (v: bigint) => v > 0n);
    });

    it("reverts when called by non-client", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);

      await expect(escrow.connect(freelancer).cancel()).to.be.revertedWith(
        "Only client can cancel"
      );
    });

    it("reverts when already cancelled", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);
      await escrow.connect(client).cancel();

      await expect(escrow.connect(client).cancel()).to.be.revertedWith(
        "Already cancelled"
      );
    });
  });

  // ── raiseDispute ───────────────────────────────────────────────────────────
  describe("raiseDispute", () => {
    it("client can raise a dispute on a completed milestone", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      await expect(escrow.connect(client).raiseDispute(0, "Work unsatisfactory"))
        .to.emit(escrow, "DisputeRaised")
        .withArgs(0, client.address, "Work unsatisfactory");
    });

    it("freelancer can raise a dispute on a completed milestone", async () => {
      const { escrow, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      await expect(escrow.connect(freelancer).raiseDispute(0, "Payment withheld"))
        .to.emit(escrow, "DisputeRaised")
        .withArgs(0, freelancer.address, "Payment withheld");
    });

    it("reverts when milestone is not completed", async () => {
      const { escrow, client } = await loadFixture(deployEscrowFixture);

      await expect(
        escrow.connect(client).raiseDispute(0, "reason")
      ).to.be.revertedWith("Not completed yet");
    });

    it("reverts when milestone is already approved", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);
      await escrow.connect(client).approveMilestone(0);

      await expect(
        escrow.connect(client).raiseDispute(0, "reason")
      ).to.be.revertedWith("Already approved");
    });

    it("reverts without reason when called by a stranger", async () => {
      // The contract has a bare require(caller == client || caller == freelancer)
      // with no message string, so it reverts without reason.
      const { escrow, freelancer, stranger } = await loadFixture(deployEscrowFixture);
      await escrow.connect(freelancer).markCompleted(0);

      await expect(
        escrow.connect(stranger).raiseDispute(0, "reason")
      ).to.be.revertedWithoutReason(ethers);
    });
  });

  // ── View helpers ───────────────────────────────────────────────────────────
  describe("View helpers", () => {
    it("isFullyReleased returns false initially", async () => {
      const { escrow } = await loadFixture(deployEscrowFixture);
      expect(await escrow.isFullyReleased()).to.be.false;
    });

    it("isFullyReleased returns true after all milestones approved", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      for (let i = 0; i < MILESTONE_COUNT; i++) {
        await completeAndApprove(escrow, freelancer, client, i);
      }

      expect(await escrow.isFullyReleased()).to.be.true;
    });

    it("getRemainingBalance decreases with each milestone release", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      for (let i = 0; i < MILESTONE_COUNT; i++) {
        await completeAndApprove(escrow, freelancer, client, i);
        const expected = TOTAL_AMOUNT - AMOUNT_PER_MILESTONE * BigInt(i + 1);
        expect(await escrow.getRemainingBalance()).to.equal(expected);
      }
    });
  });

  // ── Full happy-path flow ───────────────────────────────────────────────────
  describe("Full happy-path flow", () => {
    it("processes all milestones and leaves zero balance", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      for (let i = 0; i < MILESTONE_COUNT; i++) {
        await escrow.connect(freelancer).markCompleted(i);
        await escrow.connect(client).approveMilestone(i);
      }

      expect(await escrow.getRemainingBalance()).to.equal(0n);
      expect(await escrow.isFullyReleased()).to.be.true;
      expect(await escrow.releasedMilestones()).to.equal(MILESTONE_COUNT);
    });

    it("freelancer total payout equals total locked amount", async () => {
      const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

      let totalPaid = 0n;

      for (let i = 0; i < MILESTONE_COUNT; i++) {
        await escrow.connect(freelancer).markCompleted(i);

        const before = await ethers.provider.getBalance(freelancer.address);
        await escrow.connect(client).approveMilestone(i);
        const after = await ethers.provider.getBalance(freelancer.address);

        totalPaid += after - before;
      }

      expect(totalPaid).to.equal(TOTAL_AMOUNT);
    });
  });
});
