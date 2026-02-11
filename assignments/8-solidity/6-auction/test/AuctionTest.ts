import { expect } from 'chai';
import { network } from 'hardhat';
const { networkHelpers } = await network.connect();

const { ethers } = await network.connect();

describe('AuctionContract', () => {
  let auctionContract: any;
  const ZeroAddress = '0x0000000000000000000000000000000000000000';

  beforeEach(async () => {
    auctionContract = await ethers.deployContract('AuctionContract');
  });

  describe('Create Auction', () => {
    it('Should create an auction successfully', async () => {
      let [owner, bidder1] = await ethers.getSigners();
      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, 'AuctionInitialaized')
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();
      expect(a).to.equal(1);

      const createdAuction = await auctionContract.auctions(a);
      expect(createdAuction[0]).to.equal(1);
      expect(createdAuction[1]).to.equal(1000);
      expect(createdAuction[2]).to.equal(0);
      expect(createdAuction[3]).to.equal(owner);
      // expect(createdAuction[4]).to.equal(ZeroAddress);
      expect(createdAuction[5]).to.equal(ZeroAddress);
      // expect(createdAuction[5]).to.equal(0);
      // expect(createdAuction[6]).to.equal(1200);
    });

    // it("should create more than an auction successfully", async () => {
    //   let [owner] = await ethers.getSigners()
    //   await expect(auctionContract.createAuction(1000, 1200)).to.emit(auctionContract, "AuctionInitialaized").withArgs(1n);
    //   await auctionContract.createAuction(1000, 1200);
    //   const a = await auctionContract.auctionCounter();
    //   expect(a).to.equal(1);

    //   await expect(auctionContract.createAuction(1500, 2000)).to.emit(auctionContract, "AuctionInitialaized").withArgs(2n);
    //   await auctionContract.createAuction(1500, 2000)

    //   const b =  await auctionContract.auctionCounter();

    //   const createdAuction = await auctionContract.auctions(b);
    //   expect(createdAuction[0]).to.equal(2);
    //   expect(createdAuction[1]).to.equal(1500);
    //   expect(createdAuction[2]).to.equal(0);
    //   expect(createdAuction[3]).to.equal(owner);
    //   expect(createdAuction[4]).to.equal(ZeroAddress);
    //   expect(createdAuction[5]).to.equal(0);
    //   expect(createdAuction[6]).to.equal(2000);

    // })
  });

  describe('Start Auction', () => {
    it('Should Start Auction Successfully', async () => {
      let [owner] = await ethers.getSigners();
      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, 'AuctionInitialaized')
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await auctionContract.startAuction(a);
      const currentTime = await networkHelpers.time.latest();

      const startedAuction = await auctionContract.auctions(a);
      expect(startedAuction[2]).to.equal(1);
      expect(startedAuction[5]).to.be.closeTo(currentTime, 5);
    });

    it('Should Fail When a Wrong address tries to start the Auction', async () => {
      let [owner, addr1] = await ethers.getSigners();
      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, 'AuctionInitialaized')
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await expect(
        auctionContract.connect(addr1).startAuction(a)
      ).to.be.revertedWith('Not your Auction');
    });
  });

  // describe("Bidding", () => {
  //   const STARTING_PRICE = ethers.parseEther("2");
  //   const DURATION = 3600;

  //   let owner: any, bidder1: any, bidder2: any;

  //   beforeEach(async () => {
  //     [owner, bidder1, bidder2] = await ethers.getSigners();

  //     await auctionContract.createAuction(STARTING_PRICE, DURATION);
  //     const auctionId = await auctionContract.auctionCounter();
  //     await auctionContract.startAuction(auctionId);
  //   });

  //   it("This should fail if owner tries to bid", async () => {
  //     const auctionId = await auctionContract.auctionCounter();
  //     await expect(
  //       auctionContract.bid(auctionId, { value: STARTING_PRICE })
  //     ).to.be.revertedWith("You can't bid on your own auction");
  //   });

  //   it("This should fail if msg.value is zero", async () => {
  //     const auctionId = await auctionContract.auctionCounter();
  //     expect(
  //       auctionContract.connect(bidder1).bid(auctionId, { value: 0 })
  //     ).to.be.revertedWith("Send Eth greater than zero");
  //   });

  //   it("This should allow a valid bid", async () => {
  //     const auctionId = await auctionContract.auctionCounter();

  //     await auctionContract
  //       .connect(bidder1)
  //       .bid(auctionId, { value: STARTING_PRICE });

  //     const auction = await auctionContract.auctions(auctionId);
  //     expect(auction.highestBid).to.equal(STARTING_PRICE);
  //     expect(auction.highestBidder).to.equal(bidder1.address);
  //   });

  //   it.only("Should refund previous highest bidder", async () => {
  //     const auctionId = await auctionContract.auctionCounter();
  //     let bidAmount = await ethers.parseEther('3');

  //     await auctionContract
  //       .connect(bidder1)
  //       .bid(auctionId, { value: bidAmount});

  //     await auctionContract
  //       .connect(bidder2)
  //       .bid(auctionId, { value: ethers.parseEther("3") });

  //     const refund = await auctionContract.refundBidders(
  //       auctionId,
  //       bidder1.address
  //     );
  //     expect(refund).to.equal(STARTING_PRICE);
  //   });
  // });

  // describe("End Auction", () => {
  //   it("Should fail if auction not ended yet", async () => {
  //     const [owner, bidder] = await ethers.getSigners();

  //     await auctionContract.createAuction(
  //       ethers.parseEther("1"),
  //       3600
  //     );
  //     const auctionId = await auctionContract.auctionCounter();
  //     await auctionContract.startAuction(auctionId);

  //     await expect(
  //       auctionContract.endAuction(auctionId)
  //     ).to.be.revertedWith("Auction not ended yet");
  //   });

  //   it("Should transfer funds to owner when auction ends", async () => {
  //     const [owner, bidder] = await ethers.getSigners();

  //     await auctionContract.createAuction(
  //       ethers.parseEther("1"),
  //       3600
  //     );
  //     const auctionId = await auctionContract.auctionCounter();
  //     await auctionContract.startAuction(auctionId);

  //     await auctionContract.connect(bidder).bid(auctionId, {
  //       value: ethers.parseEther("2"),
  //     });

  //     await networkHelpers.time.increase(3601);

  //     const auction = await auctionContract.auctions(auctionId);
  //     expect(auction.status).to.equal(2); // Completed
  //   });
  // });

  // describe("Refund Bidders", () => {
  //   it("Should allow bidder to withdraw refund", async () => {
  //     const [owner, bidder1, bidder2] = await ethers.getSigners();

  //     await auctionContract.createAuction(
  //       ethers.parseEther("1"),
  //       3600
  //     );
  //     const auctionId = await auctionContract.auctionCounter();
  //     await auctionContract.startAuction(auctionId);

  //     await auctionContract.connect(bidder1).bid(auctionId, {
  //       value: ethers.parseEther("1"),
  //     });

  //     await auctionContract.connect(bidder2).bid(auctionId, {
  //       value: ethers.parseEther("2"),
  //     });

  //   });
  // });
});
