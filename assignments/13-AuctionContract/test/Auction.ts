import { expect } from "chai";
import { network } from "hardhat";
const { networkHelpers } = await network.connect();

const { ethers } = await network.connect();

describe("AuctionContract", function () {
  let auctionContract: any;
  const ZeroAddress = "0x0000000000000000000000000000000000000000";

  beforeEach(async () => {
    console.log("a");

    auctionContract = await ethers.deployContract("AuctionContract");
    console.log("b");
  });

  describe("Create Auction", function () {
    it("should create an auction successfully", async () => {
      console.log("1");
      let [owner] = await ethers.getSigners();
      console.log("2");
      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      console.log("3");
      const a = await auctionContract.auctionCounter();
      console.log("4");
      expect(a).to.equal(1);
      console.log("5");

      const createdAuction = await auctionContract.auctions(a);
      expect(createdAuction.id).to.equal(1);
      expect(createdAuction.startingPrice).to.equal(1000);
      expect(createdAuction.highestBid).to.equal(1000);
      expect(createdAuction.status).to.equal(0);
      expect(createdAuction.owner).to.equal(owner.address);
      expect(createdAuction.highestBidder).to.equal(ZeroAddress);
      expect(createdAuction.startTime).to.equal(0);
      expect(createdAuction.duration).to.equal(1200);
    });

    it("should create more than an auction successfully", async () => {
      let [owner] = await ethers.getSigners();
      //  await expect(auctionContract.createAuction(1000, 1200)).to.emit(auctionContract, "AuctionInitialaized").withArgs(1n);
      await auctionContract.createAuction(1000, 1200);
      const a = await auctionContract.auctionCounter();
      expect(a).to.equal(1);

      //  await expect(auctionContract.createAuction(1500, 2000)).to.emit(auctionContract, "AuctionInitialaized").withArgs(2n);
      await auctionContract.createAuction(1500, 2000);

      const b = await auctionContract.auctionCounter();

      const createdAuction = await auctionContract.auctions(b);
      expect(createdAuction.id).to.equal(2);
      expect(createdAuction.startingPrice).to.equal(1500);
      expect(createdAuction.highestBid).to.equal(0);
      expect(createdAuction.status).to.equal(0);
      expect(createdAuction.owner).to.equal(owner.address);
      expect(createdAuction.highestBidder).to.equal(ZeroAddress);
      expect(createdAuction.startTime).to.equal(0);
      expect(createdAuction.dutration).to.equal(2000);
    });
  });

  describe.only("Start Auction", () => {
    it("Should Start Auction Successfully", async () => {
      let [owner] = await ethers.getSigners();
      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await auctionContract.startAuction(a);
      const currentTime = await networkHelpers.time.latest();

      const startedAuction = await auctionContract.auctions(a);
      expect(startedAuction.status).to.equal(1);
      expect(startedAuction.startTime).to.be.closeTo(currentTime, 5);
    });
    it("Should Fail When a Wrong address tries to start the Auction", async () => {
      let [owner, addr1] = await ethers.getSigners();
      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await expect(
        auctionContract.connect(addr1).startAuction(a),
      ).to.be.revertedWith("Not your Auction");
    });
  });

  describe.only("Bid for Auction", () => {
    it("Should allow valid bids to be placed", async () => {
      let [owner, addr1] = await ethers.getSigners();

      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await auctionContract.startAuction(a);
      await expect(auctionContract.connect(addr1).bids(a, { value: 1500 }))
        .to.emit(auctionContract, "BidMade")
        .withArgs(addr1.address, 1500, a);
      const startedAuction = await auctionContract.auctions(a);
      expect(startedAuction.highestBid).to.equal(1500);
      expect(startedAuction.highestBidder).to.equal(addr1.address);
      const bid = await auctionContract.bidRecords(a, addr1.address);
      expect(bid).to.equal(1500);
    });
    it("Should allow multiple bids to be placed", async () => {
      let [owner, addr1, addr2] = await ethers.getSigners();

      await expect(auctionContract.createAuction(2000, 5000))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await auctionContract.startAuction(a);
      await expect(auctionContract.connect(addr1).bids(a, { value: 2100 }))
        .to.emit(auctionContract, "BidMade")
        .withArgs(addr1.address, 2100, a);

      await expect(auctionContract.connect(addr2).bids(a, { value: 3000 }))
        .to.emit(auctionContract, "BidMade")
        .withArgs(addr2.address, 3000, a);

      const startedAuction = await auctionContract.auctions(a);

      expect(startedAuction.highestBid).to.equal(3000);
      expect(startedAuction.highestBidder).to.equal(addr2.address);

      const bid1 = await auctionContract.bidRecords(a, addr1.address);
      expect(bid1).to.equal(2100);
      const bid2 = await auctionContract.bidRecords(a, addr2.address);
      expect(bid2).to.equal(3000);
    });
    it("Should fail when value is less than or equal to zero", async () => {
      let [owner, addr1, addr2] = await ethers.getSigners();

      await expect(auctionContract.createAuction(2000, 5000))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await auctionContract.startAuction(a);
      await expect(
        auctionContract.connect(addr1).bids(a, { value: 0 }),
      ).to.be.revertedWith("Value should be greater than 0");
    });
    it("Should fail when owner tries to bid in his own auction", async () => {
      let [owner, addr1, addr2] = await ethers.getSigners();

      await expect(auctionContract.createAuction(2000, 5000))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await auctionContract.startAuction(a);
      await expect(
        auctionContract.connect(owner).bids(a, { value: 2001 }),
      ).to.be.revertedWith("Owner should not bid");
    });
    it("Should fail when bid is not more than highest bid", async () => {
      let [owner, addr1, addr2] = await ethers.getSigners();

      await expect(auctionContract.createAuction(2000, 5000))
        .to.emit(auctionContract, "AuctionInitialaized")
        .withArgs(1n);
      const a = await auctionContract.auctionCounter();

      await auctionContract.startAuction(a);
      await expect(auctionContract.connect(addr1).bids(a, { value: 2500 }))
        .to.emit(auctionContract, "BidMade")
        .withArgs(addr1.address, 2500, a);
      await expect(
        auctionContract.connect(addr2).bids(a, { value: 2500 }),
      ).to.be.revertedWith("Not highest bid");
    });
  });

  describe.only("End Auction", () => {
    it("Should fail if auction duration has not passed", async () => {
      const [owner, addr1] = await ethers.getSigners();

      await auctionContract.createAuction(1000, 1200);
      const auctionId = await auctionContract.auctionCounter();

      await auctionContract.startAuction(auctionId);

      await expect(auctionContract.end(auctionId)).to.be.revertedWith(
        "Auction not ended",
      );
    });

    it("Should fail if non-owner tries to end auction", async () => {
      const [owner, addr1] = await ethers.getSigners();

      await auctionContract.createAuction(1000, 1200);
      const auctionId = await auctionContract.auctionCounter();

      await auctionContract.startAuction(auctionId);

      const auction = await auctionContract.auctions(auctionId);
      const endTime = Number(auction.startTime) + Number(auction.duration);
      await networkHelpers.time.increaseTo(endTime + 1);
      await networkHelpers.mine(); // Mine a block

      await expect(
        auctionContract.connect(addr1).end(auctionId),
      ).to.be.revertedWith("Not owner");
    });
  });
});
