import { expect } from 'chai';
import { Contract } from 'ethers';
import { network } from 'hardhat';

const { ethers } = await network.connect();
let TimelockV1: any;
let addr1: any;
let addr2: any;

// util functions
const toWei = (amount: string) => {
  ethers.parseEther(amount);
};
describe('TimelockV1 Test Suite', () => {
  beforeEach(async () => {
    TimelockV1 = await ethers.deployContract('TimeLockV1');
    [addr1, addr2] = await ethers.getSigners();
  });

  describe('Deployment', () => {
    it('should set default  storage values', async () => {
      let vaults = await TimelockV1.getAllVaults(addr1);
      // assert that there are no vaults
      expect(vaults.length).to.be.eq(0);

      // assert that attempt to access non-existent ID reverts
      await expect(TimelockV1.getVault(addr1, 0)).to.be.revertedWith(
        'Invalid vault ID'
      );

      // assert that attempt to access non-existent ID reverts
      await expect(TimelockV1.getVault(addr2, 0)).to.be.revertedWith(
        'Invalid vault ID'
      );
    });
  });

  describe('Transactions', () => {
    describe('Deposit Transction', () => {
      describe('Validations', () => {
        it('should revert attempt to deposit 0 ETH to the vault', async () => {
          let amount = '0';
          await expect(
            TimelockV1.connect(addr1).deposit(0, { value: toWei(amount)})
          ).to.be.revertedWith('Deposit must be greater than zero');
        });
      });
    });
  });
});
