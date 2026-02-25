## TEST PLACE BID()
it("Should allow a valid bid", async () => {
  const [, bidder1] = await ethers.getSigners();

  await auctionCont.connect(bidder1).placeBid({
    value: ethers.parseEther("2"),
  });

  expect(await auctionCont.highestBid()).to.equal(
    ethers.parseEther("2")
  );

  expect(await auctionCont.highestBidder()).to.equal(
    bidder1.address
  );
});


#### SHOULD REJECT BID LOWER THAN HIGHEST BID
it("Should reject bid lower than highest bid", async () => {
  const [, bidder1] = await ethers.getSigners();

  await expect(
    auctionCont.connect(bidder1).placeBid({
      value: ethers.parseEther("0.5"),
    })
  ).to.be.revertedWith("Bid must be higher than current highest bid");
});


#### OWNER SHOULD NOT BE ABLE TO BID
it("Should not allow owner to bid", async () => {
  await expect(
    auctionCont.placeBid({ value: ethers.parseEther("2") })
  ).to.be.revertedWith("owner cannot bid");
});


## TEST END AUCTION()
it("Should end auction after time passes", async () => {
  const [, bidder1] = await ethers.getSigners();

  await auctionCont.connect(bidder1).placeBid({
    value: ethers.parseEther("2"),
  });

  await networkHelpers.time.increase(365 * 24 * 60 * 60);

  await auctionCont.endAuction();

  expect(await auctionCont.isActive()).to.equal(false);
});



## TEST ETH TRANSFER ON END
it("Should transfer highest bid to owner when auction ends", async () => {
  const [owner, bidder1] = await ethers.getSigners();

  await auctionCont.connect(bidder1).placeBid({
    value: ethers.parseEther("2"),
  });

  await networkHelpers.time.increase(365 * 24 * 60 * 60);

  await expect(() =>
    auctionCont.endAuction()
  ).to.changeEtherBalance(owner, ethers.parseEther("2"));
});



## TEST REFUNDS()
it("Should allow bidder to refund after auction ends", async () => {
  const [, bidder1] = await ethers.getSigners();

  await auctionCont.connect(bidder1).placeBid({
    value: ethers.parseEther("2"),
  });

  await networkHelpers.time.increase(365 * 24 * 60 * 60);

  await auctionCont.endAuction();

  await expect(() =>
    auctionCont.connect(bidder1).refunds()
  ).to.changeEtherBalance(bidder1, ethers.parseEther("2"));
});



## TEST EVENTS
it("Should emit NewHighestBid event", async () => {
  const [, bidder1] = await ethers.getSigners();

  await expect(
    auctionCont.connect(bidder1).placeBid({
      value: ethers.parseEther("2"),
    })
  )
    .to.emit(auctionCont, "NewHighestBid")
    .withArgs(bidder1.address, ethers.parseEther("2"));
});
