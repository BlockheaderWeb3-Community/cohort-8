import { expect } from 'chai';
import { Contract } from 'ethers';
import { network } from 'hardhat';

const { ethers } = await network.connect();

// deploy util function
const deployCounterV1 = async (contract: string) => {
  const CounterV1: Contract = await ethers.deployContract(contract);
  return CounterV1;
};

describe('CounterV1 Contract Suite', async () => {
  describe('Deployment', () => {
    it('should return default storage value', async () => {
      // call our deploy util fn
      const deployedCounterV1: Contract = await deployCounterV1('CounterV1');
      // assert that default storage value of x = 0
      expect(await deployedCounterV1.x()).to.eq(0);
    });
  });

  describe('Transactions', () => {
    it('should increase x value by 1', async () => {
      // call our deploy util fn
      const deployedCounterV1: Contract = await deployCounterV1('CounterV1');
      const count1 = await deployedCounterV1.x();

      await deployedCounterV1.inc();

      const count2 = await deployedCounterV1.x();
      console.log('count 2____', count2);
      expect(count2).to.eq(count1 + 1n);
    });

    it('should increase x value when inc() is called multiple times ', async () => {
      // call our deploy util fn
      const deployedCounterV1: Contract = await deployCounterV1('CounterV1');
      const count1 = await deployedCounterV1.x();

      const increaseNumber = 1n;
      await deployedCounterV1.inc();

      const count2 = await deployedCounterV1.x();
      console.log('count 2____', count2);
      expect(count2).to.eq(count1 + 1n);

      await deployedCounterV1.inc();

      const count3 = await deployedCounterV1.x();
      expect(count3).to.eq(count2 + increaseNumber);
    });
  });
});
