import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("MultiEscrowFactory / SimpleEscrow", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [buyer, seller, owner] = await viem.getWalletClients();

  async function deployFactory() {
    return viem.deployContract("MultiEscrowFactory", [], {
      client: { wallet: buyer, public: publicClient },
    });
  }

  it("creates escrow and completes happy path flow", async function () {
    const factory = await deployFactory();
    const deploymentBlock = await publicClient.getBlockNumber();

    await factory.write.createEscrow([
      seller.account.address,
      owner.account.address,
    ]);

    const events = await publicClient.getContractEvents({
      address: factory.address,
      abi: factory.abi,
      eventName: "EscrowCreated",
      fromBlock: deploymentBlock,
      strict: true,
    });

    const escrowAddress = events[0]?.args.escrow;
    assert.ok(escrowAddress);

    const escrowAsBuyer = await viem.getContractAt(
      "SimpleEscrow",
      escrowAddress,
      { client: { wallet: buyer, public: publicClient } },
    );
    const escrowAsSeller = await viem.getContractAt(
      "SimpleEscrow",
      escrowAddress,
      { client: { wallet: seller, public: publicClient } },
    );
    const escrowAsOwner = await viem.getContractAt(
      "SimpleEscrow",
      escrowAddress,
      { client: { wallet: owner, public: publicClient } },
    );

    await escrowAsBuyer.write.deposit({ value: 2n });
    await escrowAsSeller.write.confirmDelivery();
    await escrowAsBuyer.write.confirmReceived();
    await escrowAsOwner.write.fundsRelease();

    const amount = await escrowAsBuyer.read.amount();
    assert.equal(amount, 0n);
  });

  it("rejects deposits from non-buyer", async function () {
    const factory = await deployFactory();
    const deploymentBlock = await publicClient.getBlockNumber();

    await factory.write.createEscrow([
      seller.account.address,
      owner.account.address,
    ]);

    const events = await publicClient.getContractEvents({
      address: factory.address,
      abi: factory.abi,
      eventName: "EscrowCreated",
      fromBlock: deploymentBlock,
      strict: true,
    });

    const escrowAddress = events[0]?.args.escrow;
    assert.ok(escrowAddress);

    const escrowAsSeller = await viem.getContractAt(
      "SimpleEscrow",
      escrowAddress,
      { client: { wallet: seller, public: publicClient } },
    );

    await assert.rejects(async () => {
      await escrowAsSeller.write.deposit({ value: 1n });
    });
  });
});
