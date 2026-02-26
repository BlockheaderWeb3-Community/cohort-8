<<<<<<< Updated upstream:sessions/intro-to-testing/test/CounterV1.ts
import { expect } from 'chai';
import { Contract } from 'ethers';
import { network } from 'hardhat';
||||||| Stash base:session/Testing/test/CounterV1.ts
import { expect } from "chai";
import { Contract } from "ethers";
import { network } from "hardhat";
=======
import { expect } from "chai";
import { Contract } from "ethers";
import { network } from "hardhat";
import { beforeEach, describe } from "node:test";
>>>>>>> Stashed changes:session/Testing/test/CounterV1.ts

const { ethers } = await network.connect();

let TimelockV1: any;
let addr1: any;
let addr2: any;

<<<<<<< Updated upstream:sessions/intro-to-testing/test/CounterV1.ts
describe('CounterV1 Contract Suite', async () => {
  describe('Deployment', () => {
    it('should return default storage value', async () => {
      // call our deploy util fn
      const deployedCounterV1: Contract = await deployCounterV1('CounterV1');
      // assert that default storage value of x = 0
      expect(await deployedCounterV1.x()).to.eq(0);
    });
  });
||||||| Stash base:session/Testing/test/CounterV1.ts
describe("CounterV1 Contract Suite", async () => {
  describe("Deployment", () => {
    it("should return default storage value", async () => {
      // call our deploy util fn
      const deployedCounterV1: Contract = await deployCounterV1("CounterV1");
      // assert that default storage value of x = 0
      expect(await deployedCounterV1.x()).to.eq(0);
    });
  });
=======
describe("TimelockV1 Test Suite", () => {
  beforeEach(async () => {
>>>>>>> Stashed changes:session/Testing/test/CounterV1.ts

<<<<<<< Updated upstream:sessions/intro-to-testing/test/CounterV1.ts
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
||||||| Stash base:session/Testing/test/CounterV1.ts
  describe("Transactions", () => {
    it("should increase x value by 1", async () => {
        // call our deploy util fn
      const deployedCounterV1: Contract = await deployCounterV1("CounterV1");
      const count1 = await deployedCounterV1.x();

      await deployedCounterV1.inc()

      const count2 = await deployedCounterV1.x();
      console.log("count 2____", count2)
      expect(count2).to.eq(count1 + 1n);
    })

    it("should increase x value when inc() is called multiple times ", async () => {
        // call our deploy util fn
      const deployedCounterV1: Contract = await deployCounterV1("CounterV1");
      const count1 = await deployedCounterV1.x();

      const increaseNumber = 1n;
      await deployedCounterV1.inc()

      const count2 = await deployedCounterV1.x();
      console.log("count 2____", count2)
      expect(count2).to.eq(count1 + 1n);
    
      
      await deployedCounterV1.inc()
        
      const count3 = await deployedCounterV1.x();
      expect(count3).to.eq(count2 + increaseNumber)


    })
  })
});
=======
  })
})
>>>>>>> Stashed changes:session/Testing/test/CounterV1.ts
