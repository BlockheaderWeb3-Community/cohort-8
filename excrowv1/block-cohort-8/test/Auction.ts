import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

describe("Auction", function () {
  let auction: any;
  let owner: any;
  let bidder1: any;
  let bidder2: any;
  let bidder3: any;

  const STARTING_PRICE = ethers.parseEther("1");
  const DURATION = 3600;

  beforeEach(async function () {
    [owner, bidder1, bidder2, bidder3] = await ethers.getSigners();

    const AuctionFactory = await ethers.getContractFactory("Auction");
    auction = await AuctionFactory.deploy(STARTING_PRICE, DURATION);
    await auction.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Sets correct owner", async function () {
      expect(await auction.owner()).to.equal(owner.address);
    });

    it("Sets correct starting price", async function () {
      expect(await auction.startingPrice()).to.equal(STARTING_PRICE);
    });

    it("Sets future auctionEndTime", async function () {
      const now = await networkHelpers.time.latest();
      expect(await auction.auctionEndTime()).to.be.gt(now);
    });

    it("Initializes highestBid to 0", async function () {
      expect(await auction.highestBid()).to.equal(0n);
    });

    it("Initializes ended to false", async function () {
      expect(await auction.ended()).to.equal(false);
    });
  });

  describe("bid()", function () {
    it("Accepts valid first bid", async function () {
      const bidAmount = ethers.parseEther("1.5");
      await auction.connect(bidder1).bid({ value: bidAmount });

      expect(await auction.highestBidder()).to.equal(bidder1.address);
      expect(await auction.highestBid()).to.equal(bidAmount);
    });

    it("Accepts bid equal to starting price", async function () {
      await auction.connect(bidder1).bid({ value: STARTING_PRICE });
    });

    it("Rejects bid below starting price", async function () {
      await expect(
        auction.connect(bidder1).bid({ value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Bid below starting price");
    });

    it("Rejects bid not higher than highestBid", async function () {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });

      await expect(
        auction.connect(bidder2).bid({ value: ethers.parseEther("2") })
      ).to.be.revertedWith("Bid not high enough");
    });

    it("Stores previous highest bid in pendingReturns", async function () {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });
      await auction.connect(bidder2).bid({ value: ethers.parseEther("3") });

      expect(
        await auction.pendingReturns(bidder1.address)
      ).to.equal(ethers.parseEther("2"));
    });

    it("Accumulates pendingReturns correctly", async function () {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });
      await auction.connect(bidder2).bid({ value: ethers.parseEther("3") });
      await auction.connect(bidder1).bid({ value: ethers.parseEther("4") });
      await auction.connect(bidder2).bid({ value: ethers.parseEther("5") });

      expect(
        await auction.pendingReturns(bidder1.address)
      ).to.equal(ethers.parseEther("6"));

      expect(
        await auction.pendingReturns(bidder2.address)
      ).to.equal(ethers.parseEther("3"));
    });

    it("Rejects owner bid", async function () {
      await expect(
        auction.connect(owner).bid({ value: ethers.parseEther("2") })
      ).to.be.revertedWith("Owner cannot bid");
    });

    it("Rejects bid after auction expiry", async function () {
      await networkHelpers.time.increase(DURATION + 1);

      await expect(
        auction.connect(bidder1).bid({ value: ethers.parseEther("2") })
      ).to.be.revertedWith("Auction ended");
    });
  });

  describe("withdraw()", function () {
    it("Refunds outbid bidder correctly", async function () {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });
      await auction.connect(bidder2).bid({ value: ethers.parseEther("3") });

      await expect(
        auction.connect(bidder1).withdraw()
      ).to.changeEtherBalance(
        ethers,
        bidder1,
        ethers.parseEther("2")
      );
    });

    it("Prevents double withdrawal", async function () {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });
      await auction.connect(bidder2).bid({ value: ethers.parseEther("3") });

      await auction.connect(bidder1).withdraw();

      await expect(
        auction.connect(bidder1).withdraw()
      ).to.be.revertedWith("Nothing to withdraw");
    });
  });

  describe("endAuction()", function () {
    it("Allows owner to end after expiry", async function () {
      await networkHelpers.time.increase(DURATION + 1);

      await auction.connect(owner).endAuction();
      expect(await auction.ended()).to.equal(true);
    });

    it("Reverts if called before expiry", async function () {
      await expect(
        auction.connect(owner).endAuction()
      ).to.be.revertedWith("Auction still active");
    });

    it("Reverts if non-owner calls", async function () {
      await networkHelpers.time.increase(DURATION + 1);

      await expect(
        auction.connect(bidder1).endAuction()
      ).to.be.revertedWith("Not owner");
    });
  });

  describe("ownerWithdraw()", function () {
    async function setupEndedAuction() {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });

      await networkHelpers.time.increase(DURATION + 1);
      await auction.connect(owner).endAuction();
    }

    it("Transfers winning bid to owner", async function () {
      await setupEndedAuction();

      await expect(
        auction.connect(owner).ownerWithdraw()
      ).to.changeEtherBalance(
        ethers,
        owner,
        ethers.parseEther("2")
      );
    });

    it("Zeroes highestBid after withdrawal", async function () {
      await setupEndedAuction();
      await auction.connect(owner).ownerWithdraw();

      expect(await auction.highestBid()).to.equal(0n);
    });

    it("Reverts if auction not ended", async function () {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });

      await networkHelpers.time.increase(DURATION + 1);

      await expect(
        auction.connect(owner).ownerWithdraw()
      ).to.be.revertedWith("Auction not ended");
    });
  });

  describe("End-to-end flow", function () {
    it("Runs complete auction lifecycle", async function () {
      await auction.connect(bidder1).bid({ value: ethers.parseEther("1.5") });
      await auction.connect(bidder2).bid({ value: ethers.parseEther("2.5") });
      await auction.connect(bidder3).bid({ value: ethers.parseEther("3.5") });

      expect(await auction.highestBidder()).to.equal(bidder3.address);

      await auction.connect(bidder1).withdraw();
      await auction.connect(bidder2).withdraw();

      await networkHelpers.time.increase(DURATION + 1);
      await auction.connect(owner).endAuction();

      await auction.connect(owner).ownerWithdraw();

      expect(await auction.highestBid()).to.equal(0n);
    });
  });
});
