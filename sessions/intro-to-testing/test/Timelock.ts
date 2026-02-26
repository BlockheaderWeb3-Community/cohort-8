import { expect } from 'chai';
import { BigNumberish, Contract } from 'ethers';
import { network } from 'hardhat';

const { ethers, networkHelpers } = await network.connect();
let TimeLock: any;
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

// util function to check balance
const getETHBalance = async (account: string) => {
  let result = await ethers.provider.getBalance(account);
  return fromWei(result);
};

// deploy util

describe('TimeLock Test Suite', () => {
  beforeEach(async () => {
    TimeLock = await ethers.deployContract('TimeLock');
    [addr1, addr2] = await ethers.getSigners();
  });

  describe('Deployment', () => {
    it('should set default  storage values', async () => {
      let vaults = await TimeLock.getAllVaults(addr1);
      // assert that there are no vaults
      expect(vaults.length).to.be.eq(0);

      // assert that attempt to access non-existent ID reverts
      await expect(TimeLock.getVault(addr1, 0)).to.be.revertedWith(
        'Invalid vault ID'
      );

      // assert that attempt to access non-existent ID reverts
      await expect(TimeLock.getVault(addr2, 0)).to.be.revertedWith(
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
            TimeLock.connect(addr1).deposit(0, { value: toWei(amount) })
          ).to.be.revertedWith('Deposit must be greater than zero');
        });

        it('should revert attempt to set unlock time that is past', async () => {
          let amount = '2';
          let pastTime = 1771933663;
          await expect(
            TimeLock.connect(addr1).deposit(pastTime, {
              value: toWei(amount),
            })
          ).to.be.revertedWith('Unlock time must be in the future');
        });
      });

      describe('Success Deposit Txn', () => {
        it('should deposit ETH to vault', async () => {
          const unlockTime = setTime(1);
          const depositAmount = toWei('1');
          let addr1ETHBal1 = await getETHBalance(addr1.address);
          console.log('address1 bal___', addr1ETHBal1);

          await expect(
            TimeLock.connect(addr1).deposit(unlockTime, {
              value: depositAmount,
              to: TimeLock.address,
            })
          ).to.changeEtherBalance(ethers, addr1, -depositAmount);
          
         // check sender balance
          let addr1ETHBal2 = await getETHBalance(addr1.address);
          expect(Number(addr1ETHBal2)).to.be.lte(Number(addr1ETHBal1));

          // check Timelock vault balance
          expect(toWei(await getETHBalance(TimeLock))).to.be.eq(depositAmount)

          let addr1Vault = await TimeLock.getVault(addr1, 0);
          expect(addr1Vault.balance).to.be.eq(depositAmount);
          expect(addr1Vault.unlockTime).to.eq(await unlockTime);
          expect(addr1Vault.active).to.be.eq(true);
          expect(addr1Vault.isUnlocked).to.be.eq(false);

          // assert that addr1 total vault count is 1
          expect(await TimeLock.getVaultCount(addr1)).to.be.eq(1);
        });

        it('should deposit ETH to vault multiple times', async () => {
          const unlockTime = await setTime(1);
          const depositAmount1 = toWei('1');
          const depositAmount2 = toWei('2');
          // deposit 1
          await TimeLock.connect(addr1).deposit(unlockTime, {
            value: depositAmount1,
          });

          // deposit 2
          await TimeLock.connect(addr1).deposit(unlockTime, {
            value: depositAmount2,
          });

          let addr1Vaults = await TimeLock.getAllVaults(addr1);
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

          expect(await TimeLock.getVaultCount(addr1)).to.be.eq(2);
        });
      });
    });
  });
});
