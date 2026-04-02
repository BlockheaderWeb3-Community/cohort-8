import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers, networkHelpers } = await network.connect();

describe('EscrowFactory Contract', function () {
  let factory: any;
  let escrow: any;

  let client: any;
  let freelancer: any;
  let other: any;

  const totalMilestones = 3;
  const milestoneAmount = ethers.parseEther('1');
  const approvalTimeout = 1000;

  const totalFunding = milestoneAmount * BigInt(totalMilestones);

  beforeEach(async () => {
    [client, freelancer, other] = await ethers.getSigners();

    factory = await ethers.deployContract('EscrowFactory');
    await factory.waitForDeployment();
  });

  // Create Escrow

  describe('createEscrow', () => {
    it('Should create escrow and emit EscrowCreated', async () => {
      await expect(
        factory
          .connect(client)
          .createEscrow(
            freelancer.address,
            totalMilestones,
            milestoneAmount,
            approvalTimeout,
            { value: totalFunding }
          )
      ).to.emit(factory, 'EscrowCreated');

      expect(await factory.escrowCount()).to.equal(1);
    });

    it('Should store escrow address in mapping', async () => {
      await factory
        .connect(client)
        .createEscrow(
          freelancer.address,
          totalMilestones,
          milestoneAmount,
          approvalTimeout,
          { value: totalFunding }
        );

      const escrowAddress = await factory.escrows(0);
      expect(escrowAddress).to.properAddress;
    });

    it('Should revert if funding is incorrect', async () => {
      await expect(
        factory.connect(client).createEscrow(
          freelancer.address,
          totalMilestones,
          milestoneAmount,
          approvalTimeout,
          { value: ethers.parseEther('1') } // incorrect funding
        )
      ).to.be.revertedWith('Incorrect funding');
    });
  });

  // Escrow Behviour
  describe('StandardEscrow Integration', () => {
    beforeEach(async () => {
      await factory
        .connect(client)
        .createEscrow(
          freelancer.address,
          totalMilestones,
          milestoneAmount,
          approvalTimeout,
          { value: totalFunding }
        );

      const escrowAddress = await factory.escrows(0);

      escrow = await ethers.getContractAt('StandardEscrow', escrowAddress);
    });

    it('Should initialize escrow correctly', async () => {
      expect(await escrow.client()).to.equal(client.address);
      expect(await escrow.freelancer()).to.equal(freelancer.address);
      expect(await escrow.totalMilestones()).to.equal(totalMilestones);
      expect(await escrow.milestoneAmount()).to.equal(milestoneAmount);
      expect(await escrow.status()).to.equal(0); // ACTIVE
    });

    /* =============================================================
                        MILESTONE FLOW
    ============================================================= */

    it('Freelancer can mark milestone completed', async () => {
      await escrow.connect(freelancer).markMilestoneCompleted();

      expect(await escrow.completedMilestones()).to.equal(1);
    });

    it('Should revert if non-freelancer marks milestone', async () => {
      await expect(
        escrow.connect(other).markMilestoneCompleted()
      ).to.be.revertedWith('Only freelancer');
    });

    it('Client can approve milestone and release payment', async () => {
      await escrow.connect(freelancer).markMilestoneCompleted();

      const balanceBefore = await ethers.provider.getBalance(
        freelancer.address
      );

      await escrow.connect(client).approveMilestone();

      const balanceAfter = await ethers.provider.getBalance(freelancer.address);

      expect(balanceAfter - balanceBefore).to.equal(milestoneAmount);
      expect(await escrow.releasedMilestones()).to.equal(1);
    });

    it('Should revert if non-client tries to approve', async () => {
      await escrow.connect(freelancer).markMilestoneCompleted();

      await expect(escrow.connect(other).approveMilestone()).to.be.revertedWith(
        'Only client'
      );
    });

    it('Should not release payment if no completed milestone', async () => {
      await expect(
        escrow.connect(client).approveMilestone()
      ).to.be.revertedWith('Nothing to release');
    });

    /* =============================================================
                        TIMEOUT LOGIC
    ============================================================= */

    it('Freelancer can claim timeout payment', async () => {
      await escrow.connect(freelancer).markMilestoneCompleted();

      await networkHelpers.time.increase(approvalTimeout + 1);

      const balanceBefore = await ethers.provider.getBalance(
        freelancer.address
      );
      console.log(`Balance before is: ${balanceBefore}`)

      await escrow.connect(freelancer).claimTimeoutPayment();

      const balanceAfter = await ethers.provider.getBalance(freelancer.address);
      console.log(`Balance after is: ${balanceAfter}`);
      const difference = balanceAfter - balanceBefore;
      console.log(`Difference between after and before is: ${balanceAfter} `);

      // expect(difference).to.equal(milestoneAmount);
      expect(await escrow.releasedMilestones()).to.equal(1);
    });

    it('Should revert timeout claim if timeout not reached', async () => {
      await escrow.connect(freelancer).markMilestoneCompleted();

      await expect(
        escrow.connect(freelancer).claimTimeoutPayment()
      ).to.be.revertedWith('Timeout not reached');
    });

    /* =============================================================
                        FULL COMPLETION
    ============================================================= */

    it('Should complete contract after all milestones paid', async () => {
      for (let i = 0; i < totalMilestones; i++) {
        await escrow.connect(freelancer).markMilestoneCompleted();
        await escrow.connect(client).approveMilestone();
      }

      expect(await escrow.status()).to.equal(1); // COMPLETE
      expect(await escrow.releasedMilestones()).to.equal(totalMilestones);
    });

    it('Should revert if marking milestone after completion', async () => {
      for (let i = 0; i < totalMilestones; i++) {
        await escrow.connect(freelancer).markMilestoneCompleted();
        await escrow.connect(client).approveMilestone();
      }

      await expect(
        escrow.connect(freelancer).markMilestoneCompleted()
      ).to.be.revertedWith('Not active');
    });
  });
});
