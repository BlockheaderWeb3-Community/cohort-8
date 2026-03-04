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
    amount = toWei('1');
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

describe('Withdraw Transaction', () => {
      describe('Validations', () => {
        it('should revert when vault ID is invalid', async () => {
          await expect(
            TimelockV1.connect(addr1).withdraw(0)
          ).to.be.revertedWith('Invalid vault ID');
        });

        it('should revert when vault is not active', async () => {
          const currentTime = (await ethers.provider.getBlock('latest'))!.timestamp;
          const unlockTime = currentTime + 100;
          await TimelockV1.connect(addr1).deposit(unlockTime, { value: toWei('1') });

          await ethers.provider.send('evm_increaseTime', [100]);
          await ethers.provider.send('evm_mine', []);

          await TimelockV1.connect(addr1).withdraw(0);

          await expect(
            TimelockV1.connect(addr1).withdraw(0)
          ).to.be.revertedWith('Vault is not active');
        });

        it('should revert when funds are still locked', async () => {
          const unlockTime = (await ethers.provider.getBlock('latest'))!.timestamp + 3600;
          await TimelockV1.connect(addr1).deposit(unlockTime, { value: toWei('1') });

          await expect(
            TimelockV1.connect(addr1).withdraw(0)
          ).to.be.revertedWith('Funds are still locked');
        });

        it('should revert when vault has zero balance', async () => {
          const currentTime = (await ethers.provider.getBlock('latest'))!.timestamp;
          const unlockTime = currentTime + 100;
          await TimelockV1.connect(addr1).deposit(unlockTime, { value: toWei('1') });

          await ethers.provider.send('evm_increaseTime', [100]);
          await ethers.provider.send('evm_mine', []);

          await TimelockV1.connect(addr1).withdraw(0);

          await expect(
            TimelockV1.connect(addr1).withdraw(0)
          ).to.be.revertedWith('Vault is not active');
        });
      });

      describe('Success Cases', () => {
        it('should withdraw funds and emit Withdrawn event', async () => {
          const currentTime = (await ethers.provider.getBlock('latest'))!.timestamp;
          const unlockTime = currentTime + 100;
          await TimelockV1.connect(addr1).deposit(unlockTime, { value: amount });

          await ethers.provider.send('evm_increaseTime', [100]);
          await ethers.provider.send('evm_mine', []);

          await expect(TimelockV1.connect(addr1).withdraw(0))
            .to.emit(TimelockV1, 'Withdrawn')
            .withArgs(addr1.address, 0, amount);
        });

        it('should transfer correct amount to user', async () => {
          const currentTime = (await ethers.provider.getBlock('latest'))!.timestamp;
          const unlockTime = currentTime + 100;
          const amount = toWei('1');
          await TimelockV1.connect(addr1).deposit(unlockTime, { value: amount });

          await ethers.provider.send('evm_increaseTime', [100]);
          await ethers.provider.send('evm_mine', []);

          const balanceBefore = await ethers.provider.getBalance(addr1.address);
          const tx = await TimelockV1.connect(addr1).withdraw(0);
          const receipt = await tx.wait();
          const gasCost = receipt.gasUsed * receipt.gasPrice;
          const balanceAfter = await ethers.provider.getBalance(addr1.address);

          expect(balanceAfter).to.equal(balanceBefore + amount - BigInt(gasCost));
        });

        it('should mark vault as inactive and clear balance', async () => {
          const currentTime = (await ethers.provider.getBlock('latest'))!.timestamp;
          const unlockTime = currentTime + 100;
          await TimelockV1.connect(addr1).deposit(unlockTime, { value: toWei('1') });

          await ethers.provider.send('evm_increaseTime', [100]);
          await ethers.provider.send('evm_mine', []);

          await TimelockV1.connect(addr1).withdraw(0);

          const vault = await TimelockV1.getVault(addr1.address, 0);
          expect(vault.balance).to.equal(0);
          expect(vault.active).to.be.false;
        });

        it('should allow withdrawing from specific vault when multiple exist', async () => {
          const currentTime = (await ethers.provider.getBlock('latest'))!.timestamp;
          const unlockTime1 = currentTime + 100;
          const unlockTime2 = currentTime + 7200;

          await TimelockV1.connect(addr1).deposit(unlockTime1, { value: toWei('1') });
          await TimelockV1.connect(addr1).deposit(unlockTime2, { value: toWei('2') });

          await ethers.provider.send('evm_increaseTime', [100]);
          await ethers.provider.send('evm_mine', []);

          await TimelockV1.connect(addr1).withdraw(0);

          const vault0 = await TimelockV1.getVault(addr1.address, 0);
          const vault1 = await TimelockV1.getVault(addr1.address, 1);

          expect(vault0.active).to.be.false;
          expect(vault1.active).to.be.true;
        });
      });
    });
