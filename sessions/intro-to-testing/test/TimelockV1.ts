import { expect } from 'chai';
import { BigNumberish, Contract } from 'ethers';
import { network } from 'hardhat';

const { ethers, networkHelpers } = await network.connect();
let TimelockV1: any;
let addr1: any;
let addr2: any;

interface Vault {
  balance: BigNumberish;
  unlockTime: BigNumberish;
  active: boolean;
}

// util functions //
const toWei = (amount: string) => ethers.parseEther(amount); // parse number to 18es

const fromWei = (amount: BigNumberish) => ethers.formatEther(amount); // format 18es to human-readable version

const setTime = async (hours: number = 0) =>
  (await networkHelpers.time.latest()) + hours * 60 * 60;

const setHour = async () => (await networkHelpers.time.latest()) + 60 * 60;

const increaseBlockTimestamp = async (hours: number) => {
  const provider = ethers.provider;
  await provider.send('evm_increaseTime', [hours * 3600]);
  await provider.send('evm_mine', []);
};

// const iterate = (arrayLength: number) => {
//     for (let i =0; i < arrayLength; i++) {

//     }

// }

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

          const toWeiAmount = toWei('1');

          await expect(
            TimelockV1.connect(addr1).deposit(0, { value: toWei(amount) })
          ).to.be.revertedWith('Deposit must be greater than zero');
        });

        it('should revert attempt to set unlock time that is past', async () => {
          let amount = '2';
          let pastTime = 1771933663;
          await expect(
            TimelockV1.connect(addr1).deposit(pastTime, {
              value: toWei(amount),
            })
          ).to.be.revertedWith('Deposit must be greater than zero');
        });
      });

      describe('Success Deposit Txn', () => {
        it('should deposit ETH to vault', async () => {
          const unlockTime = setTime(1);
          const depositAmount = toWei('1');
          await TimelockV1.connect(addr1).deposit(unlockTime, {
            value: depositAmount,
          });

          let addr1Vault = await TimelockV1.getVault(addr1, 0);
          expect(addr1Vault.balance).to.be.eq(depositAmount);
          expect(addr1Vault.unlockTime).to.eq(await unlockTime);
          expect(addr1Vault.active).to.be.eq(true);
          expect(addr1Vault.isUnlocked).to.be.eq(false);

          // assert that addr1 total vault count is 1
          expect(await TimelockV1.getVaultCount(addr1)).to.be.eq(1);
        });

        it.only('should deposit ETH to vault multiple times', async () => {
          const unlockTime = await setTime(1);
          const depositAmount1 = toWei('1');
          const depositAmount2 = toWei('2');
          // deposit 1
          await TimelockV1.connect(addr1).deposit(unlockTime, {
            value: depositAmount1,
          });

          // deposit 2
          await TimelockV1.connect(addr1).deposit(unlockTime, {
            value: depositAmount2,
          });

          let addr1Vaults = await TimelockV1.getAllVaults(addr1);
          addr1Vaults.forEach((e: any, i: any) => {
            if (i === 0) {
              expect(e.balance).to.eq(depositAmount1);
              expect(e.unlockTime).to.eq(unlockTime);
              expect(e.active).to.be.eq(true);
            } else if (i === 1) {
              expect(e.balance).to.eq(depositAmount2);
              expect(e.unlockTime).to.eq(unlockTime);
              expect(e.active).to.be.eq(true);
            }
          });

          expect(await TimelockV1.getVaultCount(addr1)).to.be.eq(2);
        });
      });
    });
  });
});
