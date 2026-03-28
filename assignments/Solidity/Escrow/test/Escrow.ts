import { expect } from "chai";
import { ethers } from "ethers";
import hre from "hardhat";
import { FactoryEscrow } from "../types/ethers-contracts/index.js";
import type { Signer } from "ethers";

// Get ethers with hardhat extensions
const hreEthers = (hre as any).ethers;

describe("FactoryEscrow", function () {
  let factoryEscrow: FactoryEscrow;
  let buyer: Signer;
  let seller: Signer;
  let stranger: Signer;

  const itemPrice = ethers.parseEther("1.0");

  beforeEach(async function () {
    const signers = await hreEthers.getSigners();
    buyer = signers[0];
    seller = signers[1];
    stranger = signers[2];
    const FactoryEscrowFactory = await hreEthers.getContractFactory("FactoryEscrow");
    factoryEscrow = await FactoryEscrowFactory.deploy();
  });

  describe("Order Lifecycle", function () {
    it("Should create an order successfully", async function () {
      const sellerAddress = await seller.getAddress();
      await factoryEscrow.connect(buyer).createOrder(sellerAddress, itemPrice);
      
      const order = await factoryEscrow.orders(1);
      const buyerAddress = await buyer.getAddress();
      expect(order.buyer).to.equal(buyerAddress);
      expect(order.seller).to.equal(sellerAddress);
      expect(order.amount).to.equal(itemPrice);
      expect(order.status).to.equal(1); // Status.Pending
    });

    it("Should allow the buyer to fund the order", async function () {
      const sellerAddress = await seller.getAddress();
      await factoryEscrow.connect(buyer).createOrder(sellerAddress, itemPrice);
      
      // Fund the order
      await expect(factoryEscrow.connect(buyer).fundOrder(1, { value: itemPrice }))
        .to.not.be.reverted;

      expect(await factoryEscrow.getStatus(1)).to.equal(2); // Status.Funded
    });

    it("Should release funds to the seller upon redemption", async function () {
      const sellerAddress = await seller.getAddress();
      await factoryEscrow.connect(buyer).createOrder(sellerAddress, itemPrice);
      await factoryEscrow.connect(buyer).fundOrder(1, { value: itemPrice });

      const initialSellerBalance = await hreEthers.provider.getBalance(sellerAddress);

      // Buyer redeems
      await factoryEscrow.connect(buyer).redeemOrder(1);

      const finalSellerBalance = await hreEthers.provider.getBalance(sellerAddress);
      expect(finalSellerBalance).to.equal(initialSellerBalance + itemPrice);
      expect(await factoryEscrow.getStatus(1)).to.equal(3); // Status.Completed
    });

    it("Should allow the seller to refund the buyer", async function () {
      const sellerAddress = await seller.getAddress();
      const buyerAddress = await buyer.getAddress();
      await factoryEscrow.connect(buyer).createOrder(sellerAddress, itemPrice);
      await factoryEscrow.connect(buyer).fundOrder(1, { value: itemPrice });

      const initialBuyerBalance = await hreEthers.provider.getBalance(buyerAddress);

      // Seller refunds
      await factoryEscrow.connect(seller).refundOrder(1);

      const finalBuyerBalance = await hreEthers.provider.getBalance(buyerAddress);
      // Note: We don't check exact equality here because buyer spent gas on earlier calls
      expect(finalBuyerBalance).to.be.above(initialBuyerBalance);
      expect(await factoryEscrow.getStatus(1)).to.equal(4); // Status.Refunded
    });
  });

  describe("Security & Reverts", function () {
    it("Should fail if a stranger tries to fund the order", async function () {
      const sellerAddress = await seller.getAddress();
      await factoryEscrow.connect(buyer).createOrder(sellerAddress, itemPrice);
      
      await expect(
        factoryEscrow.connect(stranger).fundOrder(1, { value: itemPrice })
      ).to.be.revertedWith("Only the buyer can fund this order");
    });

    it("Should fail if incorrect ETH amount is sent", async function () {
      const sellerAddress = await seller.getAddress();
      await factoryEscrow.connect(buyer).createOrder(sellerAddress, itemPrice);
      
      const wrongAmount = ethers.parseEther("0.5");
      await expect(
        factoryEscrow.connect(buyer).fundOrder(1, { value: wrongAmount })
      ).to.be.revertedWith("Incorrect ETH amount sent");
    });

    it("Should fail if buyer tries to redeem an unfunded order", async function () {
      const sellerAddress = await seller.getAddress();
      await factoryEscrow.connect(buyer).createOrder(sellerAddress, itemPrice);
      
      await expect(
        factoryEscrow.connect(buyer).redeemOrder(1)
      ).to.be.revertedWith("Funds must be deposited first");
    });
  });
});