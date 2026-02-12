import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers, networkHelpers } = await network.connect();

describe('TimelockVault Contract', function () {
  let vault: any;
  let owner: any;
  let addr1: any;
  const LOCK_DURATION = 1000; // seconds
  const ONE_ETH = ethers.parseEther('1');

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();

    vault = await ethers.deployContract('TimelockVault', [LOCK_DURATION], {
      value: ONE_ETH,
    });

    await vault.waitForDeployment();
  });

  describe('Deployment', () => {
    it('Should set the correct user', async () => {
      expect(await vault.user()).to.equal(owner.address);
    });

    it('Should set correct unlockTime', async () => {
      const block = await ethers.provider.getBlock('latest');
      const expectedUnlock = block!.timestamp + LOCK_DURATION;
      expect(await vault.unlockTime()).to.equal(expectedUnlock);
    });

    it('Should set status to LOCKED', async () => {
      expect(await vault.status()).to.equal(1); // LOCKED enum index
    });

    it('Should store the ETH sent', async () => {
      const balance = await ethers.provider.getBalance(
        await vault.getAddress()
      );
      expect(balance).to.equal(ONE_ETH);
    });

    it('Should emit VaultCreated event', async () => {
      const tx = await ethers.deployContract('TimelockVault', [LOCK_DURATION], {
        value: ONE_ETH
      });

      const receipt = await tx.deploymentTransaction()?.wait();

      const event = receipt!.logs.find(
        (log: any) => log.fragment?.name === 'VaultCreated'
      );

      expect(event).to.not.be.undefined;
    });

    it('Should revert if no ETH sent', async () => {
      await expect(
        ethers.deployContract('TimelockVault', [LOCK_DURATION])
      ).to.be.revertedWith('No ETH sent');
    });
  });

  describe('Withdraw', () => {
    it('Should revert if not user', async () => {
      await networkHelpers.time.increase(LOCK_DURATION);

      await expect(vault.connect(addr1).withdraw()).to.be.revertedWith(
        'Only user'
      );
    });

    it('Should revert if vault still locked', async () => {
      await expect(vault.withdraw()).to.be.revertedWith('Vault still locked');
    });

    it('Should withdraw after unlock time', async () => {
      await networkHelpers.time.increase(LOCK_DURATION);

      const initialBalance = await ethers.provider.getBalance(owner.address);

      const tx = await vault.withdraw();
      const receipt = await tx.wait();

      const gasCost = receipt!.fee!;

      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.equal(initialBalance + ONE_ETH - gasCost);

      expect(await vault.status()).to.equal(2);
    });
    

    // it('Should emit VaultWithdrawn event', async () => {
    //   await networkHelpers.time.increase(LOCK_DURATION);

    //   await expect(vault.withdraw())
    //     .to.emit(vault, 'VaultWithdrawn')
    //     .withArgs(owner.address, ONE_ETH);
    // });

    it('Should revert if already withdrawn', async () => {
      await networkHelpers.time.increase(LOCK_DURATION);

      await vault.withdraw();

      await expect(vault.withdraw()).to.be.revertedWith('Already withdrawn');
    });
  });
});
