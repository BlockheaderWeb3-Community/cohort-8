import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.connect();

describe('Algebraic Contract', () => {
  let addContract: any;
  let subtraction: any;
  let averageContract: any;

  beforeEach(async () => {
    addContract = await ethers.deployContract('Add', [5, 10]);
    subtraction = await ethers.deployContract('SubtractionContract');
    averageContract = await ethers.deployContract('Average', [4, 6]);
  });

  // Add contract
  describe('Add Contract', () => {
    it('Should set constructor values correctly', async () => {
      expect(await addContract.a()).to.equal(5);
      expect(await addContract.b()).to.equal(10);
    });

    it('Should correctly add two numbers', async () => {
      const result = await addContract.add(2, 3);
      expect(result).to.equal(5);
    });

    it('Should return 0 when adding 0 and 0', async () => {
      const result = await addContract.add(0, 0);
      expect(result).to.equal(0);
    });

    it('Should handle large numbers correctly', async () => {
      const result = await addContract.add(1000, 5000);
      expect(result).to.equal(6000);
    });
  });

  // Sub contract
  describe('Subtraction Contracts', () => {
    it('Should subtract two numbers correctly', async () => {
      const result = await subtraction.subtract(10, 5);
      expect(result).to.equal(5);
    });

    it('Should return 0 when subtracting equal numbers', async () => {
      const result = await subtraction.subtract(5, 5);
      expect(result).to.equal(0);
    });

    // it('Should revert when subtracting larger number from smaller', async () => {
    //   await expect(subtraction.subtract(11, 10)).to.be.revertedWith("The value of a is less than b");
    // });
  });

  // Average Contract
  describe('Average Contract', () => {
    it('Should correctly set inherited constructor values', async () => {
      expect(await averageContract.a()).to.equal(4);
      expect(await averageContract.b()).to.equal(6);
    });

    it('Should calculate average correctly', async () => {
      const result = await averageContract.average(4, 6);
      expect(result).to.equal(5);
    });

    it('Should handle even numbers', async () => {
      const result = await averageContract.average(10, 20);
      expect(result).to.equal(15);
    });
  });
});
