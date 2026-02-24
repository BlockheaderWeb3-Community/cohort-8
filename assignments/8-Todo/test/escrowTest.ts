import { expect } from "chai";
import { network } from "hardhat";
const { networkHelpers } = await network.connect();
const { ethers } = await network.connect();

describe("AuctionContract - Require Tests", function () {
  let auction: any, owner, addr1: any, addr2:any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const AuctionContract = await ethers.getContractFactory("AuctionContract");
    auction = await AuctionContract.deploy();
  });

  describe("createAuction", function () {
    it("should revert with non zero price", async function () {
      await expect(auction.createAuction(0, 700)).to.be.revertedWith("non zero price");
    });

    it("should revert with minimum 10mins", async function () {
      await expect(auction.createAuction(100, 500)).to.be.revertedWith("minimum 10mins");
    });
  });

  describe("startAuction", function () {
    it("should revert with Not your Auction", async function () {
      await auction.createAuction(100, 700);
      await expect(auction.connect(addr1).startAuction(1)).to.be.revertedWith("Not your Auction");
    });

    it("should revert with invalid Status", async function () {
      await auction.createAuction(100, 700);
      await auction.startAuction(1);
      await expect(auction.startAuction(1)).to.be.revertedWith("invalid Status");
    });
  });

  describe("bid", function () {
    beforeEach(async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await auction.startAuction(1);
    });

    it("should revert with Not active", async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await expect(auction.connect(addr1).bid(2, { value: ethers.parseEther("2") }))
        .to.be.revertedWith("Not active");
    });

    it("should revert with Ended", async function () {
      await networkHelpers.time.increase(701);
      await expect(auction.connect(addr1).bid(1, { value: ethers.parseEther("2") }))
        .to.be.revertedWith("Ended");
    });

    it("should revert with Bid too low", async function () {
      await auction.connect(addr1).bid(1, { value: ethers.parseEther("2") });
      await expect(auction.connect(addr2).bid(1, { value: ethers.parseEther("1.5") }))
        .to.be.revertedWith("Bid too low");
    });

    it("should revert with Below starting price", async function () {
      await expect(auction.connect(addr1).bid(1, { value: ethers.parseEther("0.5") }))
        .to.be.revertedWith("Below starting price");
    });

    it("should revert with Owner cannot bid", async function () {
      await expect(auction.bid(1, { value: ethers.parseEther("2") }))
        .to.be.revertedWith("Owner cannot bid");
    });
  });

  describe("endAuction", function () {
    it("should revert with Not active", async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await expect(auction.endAuction(1)).to.be.revertedWith("Not active");
    });

    it("should revert with Only owner", async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await auction.startAuction(1);
      await expect(auction.connect(addr1).endAuction(1)).to.be.revertedWith("Only owner");
    });

    it("should revert with Not ended", async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await auction.startAuction(1);
      await expect(auction.endAuction(1)).to.be.revertedWith("Not ended");
    });
  });

  describe("cancelAuction", function () {
    it("should revert with Only owner", async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await expect(auction.connect(addr1).cancelAuction(1)).to.be.revertedWith("Only owner");
    });

    it("should revert with Invalid", async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await auction.startAuction(1);
      await networkHelpers.time.increase(701);
      await auction.endAuction(1);
      await expect(auction.cancelAuction(1)).to.be.revertedWith("Invalid");
    });

    it("should revert with Has bids", async function () {
      await auction.createAuction(ethers.parseEther("1"), 700);
      await auction.startAuction(1);
      await auction.connect(addr1).bid(1, { value: ethers.parseEther("2") });
      await expect(auction.cancelAuction(1)).to.be.revertedWith("Has bids");
    });
  });

  describe("withdrawRefund", function () {
    it("should revert with No refund", async function () {
      await expect(auction.connect(addr1).withdrawRefund()).to.be.revertedWith("No refund");
    });
  });
});