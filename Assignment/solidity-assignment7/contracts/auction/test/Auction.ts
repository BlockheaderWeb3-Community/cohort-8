import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("SimpleAuction", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const testClient = await viem.getTestClient();
  const [owner, bidder1, bidder2] = await viem.getWalletClients();

  const startingPrice = 1n;
  const duration = 3600n;

  async function deployAuction() {
    return viem.deployContract(
      "SimpleAuction",
      [startingPrice, duration],
      { client: { wallet: owner, public: publicClient } },
    );
  }

  it("accepts higher bids and tracks refunds for outbid users", async function () {
    const auction = await deployAuction();

    const auctionAsBidder1 = await viem.getContractAt(
      "SimpleAuction",
      auction.address,
      { client: { wallet: bidder1, public: publicClient } },
    );
    const auctionAsBidder2 = await viem.getContractAt(
      "SimpleAuction",
      auction.address,
      { client: { wallet: bidder2, public: publicClient } },
    );

    await auctionAsBidder1.write.bid({ value: 2n });
    await auctionAsBidder2.write.bid({ value: 3n });

    const refund = await auction.read.pendingReturns([bidder1.account.address]);
    assert.equal(refund, 2n);

    await auctionAsBidder1.write.withdrawRefund();
    const refundAfter = await auction.read.pendingReturns([bidder1.account.address]);
    assert.equal(refundAfter, 0n);
  });

  it("rejects low or equal bids and owner bidding", async function () {
    const auction = await deployAuction();

    const auctionAsBidder1 = await viem.getContractAt(
      "SimpleAuction",
      auction.address,
      { client: { wallet: bidder1, public: publicClient } },
    );

    await auctionAsBidder1.write.bid({ value: 2n });

    await assert.rejects(async () => {
      await auctionAsBidder1.write.bid({ value: 2n });
    });

    await assert.rejects(async () => {
      await auction.write.bid({ value: 2n });
    });
  });

  it("allows owner to end after duration and prevents double end", async function () {
    const auction = await deployAuction();

    const auctionAsBidder1 = await viem.getContractAt(
      "SimpleAuction",
      auction.address,
      { client: { wallet: bidder1, public: publicClient } },
    );

    await auctionAsBidder1.write.bid({ value: 2n });

    await testClient.increaseTime({ seconds: 3600 });
    await testClient.mine({ blocks: 1 });

    await auction.write.endAuction();
    assert.equal(await auction.read.ended(), true);

    await assert.rejects(async () => {
      await auction.write.endAuction();
    });
  });

  it("rejects bids after auction ends", async function () {
    const auction = await deployAuction();

    const auctionAsBidder1 = await viem.getContractAt(
      "SimpleAuction",
      auction.address,
      { client: { wallet: bidder1, public: publicClient } },
    );

    await testClient.increaseTime({ seconds: 3600 });
    await testClient.mine({ blocks: 1 });
    await auction.write.endAuction();

    await assert.rejects(async () => {
      await auctionAsBidder1.write.bid({ value: 2n });
    });
  });

  it("rejects refund when no pending returns", async function () {
    const auction = await deployAuction();

    await assert.rejects(async () => {
      await auction.write.withdrawRefund();
    });
  });
});
