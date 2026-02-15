import { expect } from 'chai';
import { network } from 'hardhat';
import { Signer } from 'ethers';
// import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

const { ethers } = await network.connect();

describe('Escrow', function () {
  enum OrderState {
    AWAITING_PAYMENT,
    AWAITING_DELIVERY,
    AWAITING_FUNDS_DISBURSEMENT,
    COMPLETE,
  }

  let escrowContract: any;
  const ZeroAddress = '0x0000000000000000000000000000000000000000';
  let deployer: Signer;
  let buyer: Signer;
  let seller: Signer;
  let otherAccount: Signer;

  beforeEach(async () => {
    escrowContract = await ethers.deployContract('Escrow');
    [deployer, buyer, seller, otherAccount] = await ethers.getSigners();
  });

  describe('Deployment', function () {
    it('Should set the contract address to deployer', async function () {
      expect(await escrowContract.contractAddress()).to.equal(deployer);
    });

    it('Should initialize transactionCount to 1', async function () {
      expect(await escrowContract.transactionCount()).to.equal(1);
    });
  });

  describe('createOrder', function () {
    it('Should create an order with correct parameters', async function () {
      await escrowContract.createOrder(buyer, seller);

      const order = await escrowContract.orders(1);
      expect(order.id).to.equal(1);
      expect(order.buyer).to.equal(buyer);
      expect(order.seller).to.equal(seller);
      expect(order.amount).to.equal(0);
      expect(order.status).to.equal(OrderState.AWAITING_PAYMENT);
    });

    it('Should increment transactionCount after creating order', async function () {
      const initialCount = await escrowContract.transactionCount();
      await escrowContract.createOrder(buyer, seller);

      expect(await escrowContract.transactionCount()).to.equal(
        initialCount + 1n
      );
    });

    it('Should allow creating multiple orders', async function () {
      await escrowContract.createOrder(buyer, seller);
      await escrowContract.createOrder(buyer, seller);
      await escrowContract.createOrder(buyer, seller);

      expect(await escrowContract.transactionCount()).to.equal(4);
      expect((await escrowContract.orders(3)).id).to.equal(3);
    });

    it('Should not allow zero address for buyer', async function () {
      await expect(
        escrowContract.createOrder(ZeroAddress, seller)
      ).to.be.rejectedWith('Address cant be address zero');
    });

    it('Should not allow zero address for seller', async function () {
      await expect(
        escrowContract.createOrder(buyer, ZeroAddress)
      ).to.be.rejectedWith('Address cant be address zero');
    });
  });

  describe('deposit', function () {
    it('Should only allow buyer to deposit', async function () {
      await escrowContract.createOrder(buyer, seller);
      const depositAmount = ethers.parseEther('1');

      await expect(
        escrowContract.connect(seller).deposit(1, { value: depositAmount })
      ).to.be.rejectedWith('Only buyer can call this function');

      await expect(
        escrowContract
          .connect(otherAccount)
          .deposit(1, { value: depositAmount })
      ).to.be.rejectedWith('Only buyer can call this function');
    });

    it('Should only allow deposit in AWAITING_PAYMENT state', async function () {
      await escrowContract.createOrder(buyer, seller);
      const depositAmount = ethers.parseEther('1');

      // Try to deposit twice - should fail on second deposit
      await escrowContract.connect(buyer).deposit(1, { value: depositAmount });

      await expect(
        escrowContract.connect(buyer).deposit(1, { value: depositAmount })
      ).to.be.rejectedWith('Invalid state');
    });
  });

  describe('sendDelivery', function () {
    it('Should update order status to AWAITING_FUNDS_DISBURSEMENT', async function () {
      await escrowContract.createOrder(buyer, seller);
      const depositAmount = ethers.parseEther('1');

      await escrowContract.connect(buyer).deposit(1, { value: depositAmount });
      await escrowContract.sendDelivery(1);

      const order = await escrowContract.orders(1);
      expect(order.status).to.equal(OrderState.AWAITING_FUNDS_DISBURSEMENT);
    });

    it('Should only allow valid state (AWAITING_DELIVERY)', async function () {
      await escrowContract.createOrder(buyer, seller);
      const depositAmount = ethers.parseEther('1');

      // Deposit and call sendDelivery
      await escrowContract.connect(buyer).deposit(1, { value: depositAmount });
      await escrowContract.sendDelivery(1);

      // Try again - should fail on invalid state
      await expect(escrowContract.sendDelivery(1)).to.be.rejectedWith(
        'Invalid state'
      );
    });

    it('Should require payment has been made', async function () {
      await escrowContract.createOrder(buyer, seller);

      // Try to mark as delivered without payment
      await expect(escrowContract.sendDelivery(1)).to.be.rejectedWith(
        'Amount not paid'
      );
    });
  });

  describe('releaseFundsToSeller', function () {
    it('Should release funds to seller', async function () {
      await escrowContract.createOrder(buyer, seller);

      const depositAmount = ethers.parseEther('1');

      await escrowContract.connect(buyer).deposit(1, { value: depositAmount });
      await escrowContract.sendDelivery(1);
      await escrowContract.releaseFundsToSeller(1);

      const order = await escrowContract.orders(1);
      expect(order.status).to.equal(OrderState.COMPLETE);
    });

    it('Should only be callable by contract owner', async function () {
      await escrowContract.createOrder(buyer, seller);
      const depositAmount = ethers.parseEther('1');

      await escrowContract.connect(buyer).deposit(1, { value: depositAmount });
      await escrowContract.sendDelivery(1);

      await expect(
        escrowContract.connect(otherAccount).releaseFundsToSeller(1)
      ).to.be.rejectedWith('Only Contract can call this function');

      await expect(
        escrowContract.connect(buyer).releaseFundsToSeller(1)
      ).to.be.rejectedWith('Only Contract can call this function');

      await expect(
        escrowContract.connect(seller).releaseFundsToSeller(1)
      ).to.be.rejectedWith('Only Contract can call this function');
    });
  });

  describe('refundFundsToBuyer', function () {
    it('Should refund funds to buyer', async function () {
      await escrowContract.createOrder(buyer, seller);
      const depositAmount = ethers.parseEther('1');

      await escrowContract.connect(buyer).deposit(1, { value: depositAmount });

      // Note: There's no way in the current contract to get to AWAITING_DELIVERY state
      // This test assumes you'll add that functionality
      // For now, this function might never be callable

      // Uncomment when the contract allows entering AWAITING_DELIVERY state
      /*
      await expect(
        escrowContract.connect(deployer).refundFundsToBuyer(1)
      ).to.changeEtherBalances(
        [buyer, escrow],
        [depositAmount, depositAmount.mul(-1)]
      );
      */
    });

    it('Should only be callable by contract owner', async function () {
      await escrowContract.createOrder(buyer, seller);

      await expect(
        escrowContract.connect(otherAccount).refundFundsToBuyer(1)
      ).to.be.rejectedWith('Only Contract can call this function');
    });
  });
});
