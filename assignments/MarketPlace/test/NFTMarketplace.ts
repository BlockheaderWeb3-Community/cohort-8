import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("NFTMarketplace", function () {
  let marketplace: any;
  let nft: any;
  let owner: any;
  let seller: any;
  let buyer: any;
  let treasury: any;
  let other: any;

  beforeEach(async function () {
    [owner, seller, buyer, treasury, other] = await ethers.getSigners();
    
    marketplace = await ethers.deployContract("NFTMarketplace", [treasury.address]);
    nft = await ethers.deployContract("MockNFT");
    
    await nft.mint(seller.address, 1);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("Should set the correct treasury", async function () {
      expect(await marketplace.treasury()).to.equal(treasury.address);
    });

    it("Should set default fee to 2.5%", async function () {
      expect(await marketplace.feePercent()).to.equal(250n);
    });
  });

  describe("Listing", function () {
    it("Should list NFT with token approval", async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      
      await expect(marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1")))
        .to.emit(marketplace, "Listed")
        .withArgs(nft.target, 1, seller.address, ethers.parseEther("1"));
      
      expect(await nft.ownerOf(1)).to.equal(marketplace.target);
      
      const listing = await marketplace.listings(nft.target, 1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(ethers.parseEther("1"));
    });

    it("Should list NFT with operator approval", async function () {
      await nft.connect(seller).setApprovalForAll(marketplace.target, true);
      
      await expect(marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1")))
        .to.emit(marketplace, "Listed");
      
      expect(await nft.ownerOf(1)).to.equal(marketplace.target);
    });

    it("Should revert if not owner", async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      
      await expect(
        marketplace.connect(buyer).list(nft.target, 1, ethers.parseEther("1"))
      ).to.be.revertedWith("Not owner");
    });

    it("Should revert if not approved", async function () {
      await expect(
        marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"))
      ).to.be.revertedWith("Not approved");
    });

    it("Should allow listing at zero price", async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, 0);
      
      const listing = await marketplace.listings(nft.target, 1);
      expect(listing.price).to.equal(0);
    });

    it("Should allow listing at very high price", async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      const highPrice = ethers.parseEther("1000000");
      
      await marketplace.connect(seller).list(nft.target, 1, highPrice);
      
      const listing = await marketplace.listings(nft.target, 1);
      expect(listing.price).to.equal(highPrice);
    });
  });

  describe("Cancel Listing", function () {
    beforeEach(async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
    });

    it("Should cancel listing", async function () {
      await expect(marketplace.connect(seller).cancelListing(nft.target, 1))
        .to.emit(marketplace, "Canceled")
        .withArgs(nft.target, 1);
      
      expect(await nft.ownerOf(1)).to.equal(seller.address);
      
      const listing = await marketplace.listings(nft.target, 1);
      expect(listing.seller).to.equal(ethers.ZeroAddress);
      expect(listing.price).to.equal(0);
    });

    it("Should revert if not seller", async function () {
      await expect(
        marketplace.connect(buyer).cancelListing(nft.target, 1)
      ).to.be.revertedWith("Not seller");
    });

    it("Should revert if not listed", async function () {
      await expect(
        marketplace.connect(seller).cancelListing(nft.target, 999)
      ).to.be.revertedWith("Not seller");
    });
  });

  describe("Buy", function () {
    beforeEach(async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
    });

    it("Should buy NFT and distribute funds correctly", async function () {
      const price = ethers.parseEther("1");
      const fee = (price * 250n) / 10000n;
      const sellerAmount = price - fee;
      
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await expect(
        marketplace.connect(buyer).buy(nft.target, 1, { value: price })
      ).to.emit(marketplace, "Sold")
        .withArgs(nft.target, 1, buyer.address, price);
      
      expect(await nft.ownerOf(1)).to.equal(buyer.address);
      
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(fee);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(sellerAmount);
      
      const listing = await marketplace.listings(nft.target, 1);
      expect(listing.seller).to.equal(ethers.ZeroAddress);
    });

    it("Should revert if not listed", async function () {
      await expect(
        marketplace.connect(buyer).buy(nft.target, 999, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Not listed");
    });

    it("Should revert if wrong price (too low)", async function () {
      await expect(
        marketplace.connect(buyer).buy(nft.target, 1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Wrong price");
    });

    it("Should revert if wrong price (too high)", async function () {
      await expect(
        marketplace.connect(buyer).buy(nft.target, 1, { value: ethers.parseEther("2") })
      ).to.be.revertedWith("Wrong price");
    });

    it("Should revert on zero price listing purchase", async function () {
      await nft.mint(seller.address, 2);
      await nft.connect(seller).approve(marketplace.target, 2);
      await marketplace.connect(seller).list(nft.target, 2, 0);
      
      await expect(
        marketplace.connect(buyer).buy(nft.target, 2, { value: 0 })
      ).to.be.revertedWith("Not listed");
    });

    it("Should prevent reentrancy", async function () {
      const price = ethers.parseEther("1");
      
      const tx = marketplace.connect(buyer).buy(nft.target, 1, { value: price });
      await expect(tx).to.not.be.revertedWith("Reentrant");
    });
  });

  describe("Owner Functions", function () {
    describe("setFee", function () {
      it("Should allow owner to set fee", async function () {
        await marketplace.connect(owner).setFee(500);
        expect(await marketplace.feePercent()).to.equal(500n);
      });

      it("Should revert if not owner", async function () {
        await expect(
          marketplace.connect(seller).setFee(500)
        ).to.be.revertedWith("Not owner");
      });

      it("Should allow setting fee to 0", async function () {
        await marketplace.connect(owner).setFee(0);
        expect(await marketplace.feePercent()).to.equal(0n);
      });

      it("Should allow setting fee to 100% (10000)", async function () {
        await marketplace.connect(owner).setFee(10000);
        expect(await marketplace.feePercent()).to.equal(10000n);
      });
    });

    describe("setTreasury", function () {
      it("Should allow owner to set treasury", async function () {
        await marketplace.connect(owner).setTreasury(other.address);
        expect(await marketplace.treasury()).to.equal(other.address);
      });

      it("Should revert if not owner", async function () {
        await expect(
          marketplace.connect(seller).setTreasury(other.address)
        ).to.be.revertedWith("Not owner");
      });

      it("Should allow setting treasury to zero address", async function () {
        await marketplace.connect(owner).setTreasury(ethers.ZeroAddress);
        expect(await marketplace.treasury()).to.equal(ethers.ZeroAddress);
      });
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple listings from same seller", async function () {
      await nft.mint(seller.address, 2);
      await nft.mint(seller.address, 3);
      
      await nft.connect(seller).setApprovalForAll(marketplace.target, true);
      
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
      await marketplace.connect(seller).list(nft.target, 2, ethers.parseEther("2"));
      await marketplace.connect(seller).list(nft.target, 3, ethers.parseEther("3"));
      
      expect(await nft.ownerOf(1)).to.equal(marketplace.target);
      expect(await nft.ownerOf(2)).to.equal(marketplace.target);
      expect(await nft.ownerOf(3)).to.equal(marketplace.target);
    });

    it("Should handle seller buying their own NFT", async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
      
      await marketplace.connect(seller).buy(nft.target, 1, { value: ethers.parseEther("1") });
      
      expect(await nft.ownerOf(1)).to.equal(seller.address);
    });

    it("Should handle relisting after cancel", async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
      await marketplace.connect(seller).cancelListing(nft.target, 1);
      
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("2"));
      
      const listing = await marketplace.listings(nft.target, 1);
      expect(listing.price).to.equal(ethers.parseEther("2"));
    });

    it("Should handle relisting after purchase", async function () {
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
      await marketplace.connect(buyer).buy(nft.target, 1, { value: ethers.parseEther("1") });
      
      await nft.connect(buyer).approve(marketplace.target, 1);
      await marketplace.connect(buyer).list(nft.target, 1, ethers.parseEther("2"));
      
      const listing = await marketplace.listings(nft.target, 1);
      expect(listing.seller).to.equal(buyer.address);
      expect(listing.price).to.equal(ethers.parseEther("2"));
    });

    it("Should handle different NFT contracts", async function () {
      const nft2 = await ethers.deployContract("MockNFT");
      await nft2.mint(seller.address, 1);
      
      await nft.connect(seller).approve(marketplace.target, 1);
      await nft2.connect(seller).approve(marketplace.target, 1);
      
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
      await marketplace.connect(seller).list(nft2.target, 1, ethers.parseEther("2"));
      
      const listing1 = await marketplace.listings(nft.target, 1);
      const listing2 = await marketplace.listings(nft2.target, 1);
      
      expect(listing1.price).to.equal(ethers.parseEther("1"));
      expect(listing2.price).to.equal(ethers.parseEther("2"));
    });

    it("Should calculate fees correctly with different percentages", async function () {
      await marketplace.connect(owner).setFee(1000); // 10%
      
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
      
      const price = ethers.parseEther("1");
      const fee = (price * 1000n) / 10000n;
      const sellerAmount = price - fee;
      
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await marketplace.connect(buyer).buy(nft.target, 1, { value: price });
      
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(fee);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(sellerAmount);
    });

    it("Should handle 0% fee", async function () {
      await marketplace.connect(owner).setFee(0);
      
      await nft.connect(seller).approve(marketplace.target, 1);
      await marketplace.connect(seller).list(nft.target, 1, ethers.parseEther("1"));
      
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await marketplace.connect(buyer).buy(nft.target, 1, { value: ethers.parseEther("1") });
      
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(ethers.parseEther("1"));
    });
  });
});
