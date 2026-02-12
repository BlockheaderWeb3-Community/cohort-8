import { expect } from 'chai';
import { network } from 'hardhat';
const { networkHelpers } = await network.connect();
const { ethers } = await network.connect();

describe('AuctionContract', () => {
  let auctionContract: any;

  // Zero address used for comparisons where needed
  const ZeroAddress = '0x0000000000000000000000000000000000000000';

  // Deploy a fresh contract before every test
  beforeEach(async () => {
    auctionContract = await ethers.deployContract('AuctionContract');
  });

  describe('Start Auction', () => {
    it('Should Start Auction Successfully', async () => {
      // Get contract owner
      let [owner] = await ethers.getSigners();

      // Create a new auction
      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, 'AuctionInitialaized')
        .withArgs(1n);

      const a = await auctionContract.auctionCounter();

      // Start the auction
      await auctionContract.startAuction(a);

      // Get latest blockchain time
      const currentTime = await networkHelpers.time.latest();

      // Fetch updated auction data
      const startedAuction = await auctionContract.auctions(a);

      // Status should be OnGoing (1)
      expect(startedAuction[2]).to.equal(1);

      // Start time should be close to current block timestamp
      expect(Number(startedAuction[6])).to.be.closeTo(currentTime, 9);
    });

    it('Should Fail When a Wrong address tries to start the Auction', async () => {
      // Owner creates auction
      let [owner, addr1] = await ethers.getSigners();

      await expect(auctionContract.createAuction(1000, 1200))
        .to.emit(auctionContract, 'AuctionInitialaized')
        .withArgs(1n);

      const a = await auctionContract.auctionCounter();

      // Non-owner attempts to start auction
      await expect(
        auctionContract.connect(addr1).startAuction(a)
      ).to.be.revertedWith('Not your Auction');
    });
  });

  describe('Bidding', () => {
    const STARTING_PRICE = ethers.parseEther('2');
    const DURATION = 3600;

    let owner: any, bidder1: any, bidder2: any;

    // Create and start a fresh auction before each bidding test
    beforeEach(async () => {
      [owner, bidder1, bidder2] = await ethers.getSigners();

      await auctionContract.createAuction(STARTING_PRICE, DURATION);
      const auctionId = await auctionContract.auctionCounter();
      await auctionContract.startAuction(auctionId);
    });

    it('Should fail if owner tries to bid', async () => {
      const auctionId = await auctionContract.auctionCounter();

      // Owner is not allowed to bid on their own auction
      await expect(
        auctionContract.bid(auctionId, { value: STARTING_PRICE })
      ).to.be.revertedWith('Owner cannot bid');
    });

    it('Should fail if msg.value is zero', async () => {
      const auctionId = await auctionContract.auctionCounter();

      // Bids must contain ETH
      await expect(
        auctionContract.connect(bidder1).bid(auctionId, { value: 0 })
      ).to.be.revertedWith('Bid must be greater than zero');
    });

    it('Should fail if below starting price', async () => {
      const auctionId = await auctionContract.auctionCounter();

      // First bid must respect starting price
      await expect(
        auctionContract
          .connect(bidder1)
          .bid(auctionId, { value: ethers.parseEther('1') })
      ).to.be.revertedWith('Below starting price');
    });

    it('Should allow valid first bid', async () => {
      const auctionId = await auctionContract.auctionCounter();

      // Valid bid equal to starting price
      await auctionContract
        .connect(bidder1)
        .bid(auctionId, { value: STARTING_PRICE });

      const auction = await auctionContract.auctions(auctionId);

      // Highest bid and bidder should update correctly
      expect(auction.highestBid).to.equal(STARTING_PRICE);
      expect(auction.highestBidder).to.equal(bidder1.address);
    });

    it('Should refund previous highest bidder', async () => {
      const auctionId = await auctionContract.auctionCounter();

      // First bidder places initial bid
      await auctionContract
        .connect(bidder1)
        .bid(auctionId, { value: STARTING_PRICE });

      // Second bidder overbids
      const higherBid = ethers.parseEther('3');

      await auctionContract
        .connect(bidder2)
        .bid(auctionId, { value: higherBid });

      // Previous bidder should now have refundable balance
      const refund = await auctionContract.refunds(auctionId, bidder1.address);

      expect(refund).to.equal(STARTING_PRICE);
    });
  });

  describe('Withdraw', () => {
    it('Should allow bidder to withdraw refund', async () => {
      const [owner, bidder1, bidder2] = await ethers.getSigners();

      // Create and start auction
      await auctionContract.createAuction(ethers.parseEther('1'), 3600);
      const auctionId = await auctionContract.auctionCounter();
      await auctionContract.startAuction(auctionId);

      // First bid
      await auctionContract.connect(bidder1).bid(auctionId, {
        value: ethers.parseEther('1'),
      });

      // Second bid outbids first bidder
      await auctionContract.connect(bidder2).bid(auctionId, {
        value: ethers.parseEther('2'),
      });

      // Confirm refund exists
      const refundBefore = await auctionContract.refunds(
        auctionId,
        bidder1.address
      );

      expect(refundBefore).to.equal(ethers.parseEther('1'));

      // Capture balance before withdraw
      const balanceBefore = await ethers.provider.getBalance(bidder1.address);

      // Withdraw refund
      const tx = await auctionContract.connect(bidder1).withdraw(auctionId);
      const receipt = await tx.wait();

      // Calculate gas used for accurate balance assertion
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice!;

      const balanceAfter = await ethers.provider.getBalance(bidder1.address);

      // Balance should increase by refund amount minus gas
      expect(balanceAfter).to.equal(balanceBefore + refundBefore - gasUsed);

      // Refund mapping should reset to zero
      const refundAfter = await auctionContract.refunds(
        auctionId,
        bidder1.address
      );

      expect(refundAfter).to.equal(0);
    });

    it('Should fail if no funds to withdraw', async () => {
      const [owner, bidder1] = await ethers.getSigners();

      await auctionContract.createAuction(ethers.parseEther('1'), 3600);
      const auctionId = await auctionContract.auctionCounter();
      await auctionContract.startAuction(auctionId);

      // Attempt withdraw without being outbid
      await expect(
        auctionContract.connect(bidder1).withdraw(auctionId)
      ).to.be.revertedWith('No funds to withdraw');
    });
  });

  describe('Refund Bidders', () => {
    it('Should allow bidder to withdraw refund', async () => {
      const [owner, bidder1, bidder2] = await ethers.getSigners();

      // Create and start auction
      await auctionContract.createAuction(ethers.parseEther('1'), 3600);

      const auctionId = await auctionContract.auctionCounter();
      await auctionContract.startAuction(auctionId);

      // First bid
      await auctionContract.connect(bidder1).bid(auctionId, {
        value: ethers.parseEther('1'),
      });

      // Second bid triggers refund logic internally
      await auctionContract.connect(bidder2).bid(auctionId, {
        value: ethers.parseEther('2'),
      });

    });
  });
});
