import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Escrow", function () {
  const one = ethers.parseEther("1");
  const setup = async () => {
    const [agent, buyer, seller, other] = await ethers.getSigners();
    const e = await ethers.deployContract("Escrow", [buyer.address, seller.address]);
    return { e, agent, buyer, seller, other };
  };

  it("buyer deposits, confirms delivery, escrow releases to seller", async function () {
    const { e, buyer, seller } = await setup();
    await e.connect(buyer).deposit({ value: one });
    await e.connect(buyer).confirmDelivery();
    await e.releaseFunds();
    expect(await ethers.provider.getBalance(await e.getAddress())).to.equal(0n);
    expect(await e.state()).to.equal(2n);
  });

  it("enforces roles and requires delivery confirmation before release", async function () {
    const { e, buyer, other } = await setup();
    await expect(e.connect(other).deposit({ value: one })).to.be.revertedWith("Only buyer");
    await e.connect(buyer).deposit({ value: one });
    await expect(e.releaseFunds()).to.be.revertedWith("Delivery not confirmed");
    await expect(e.connect(other).confirmDelivery()).to.be.revertedWith("Only buyer");
  });

  it("escrow can refund buyer in delivery stage", async function () {
    const { e, buyer, other } = await setup();
    await e.connect(buyer).deposit({ value: one });
    await e.refundBuyer();
    expect(await ethers.provider.getBalance(await e.getAddress())).to.equal(0n);
    await expect(e.refundBuyer()).to.be.revertedWith("Invalid state");
    await expect(e.connect(other).releaseFunds()).to.be.revertedWith("Only escrow agent");
  });
});
