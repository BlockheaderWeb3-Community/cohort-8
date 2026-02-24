import { expect } from "chai";
import { network } from "hardhat";

describe("Escrow + EscrowFactory", function () {
  let ethers: any;
  let networkHelpers: any;

  before(async () => {
    const connection = await network.connect();
    ethers = connection.ethers;
    networkHelpers = connection.networkHelpers;
  });

  async function deployFactoryFixture() {
    const [agent, buyer, seller, other] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("EscrowFactory");
    const factory = await Factory.deploy();

    return { factory, agent, buyer, seller, other };
  }

  describe("Factory", function () {
    it("Should create an escrow and store it", async () => {
      const { factory, buyer, seller } = await networkHelpers.loadFixture(
        deployFactoryFixture,
      );

      await expect(factory.connect(buyer).createEscrow(seller.address)).to.emit(
        factory,
        "EscrowCreated",
      );

      expect(await factory.getEscrowCount()).to.equal(1);

      const escrowAddress = await factory.getEscrow(0);
      expect(escrowAddress).to.properAddress;
    });

    it("Should revert for invalid index", async () => {
      const { factory } = await networkHelpers.loadFixture(
        deployFactoryFixture,
      );

      await expect(factory.getEscrow(0)).to.be.revertedWith(
        "Index is out of range",
      );
    });
  });

  describe("Escrow Workflow", function () {
    async function deployEscrowFixture() {
      // const { factory, agent, buyer, seller, other } =
      //   await deployFactoryFixture();
      const [factory, agent, buyer, seller, other] = await ethers.getSigners();

      await factory.connect(buyer).createEscrow(seller.address);

      const escrowAddress = await factory.getEscrow(0);
      const escrow = await ethers.getContractAt("Escrow", escrowAddress);
      //   console.log(`The address for escrow`,escrow.runner.address);
      //   console.log(`The address for agent`, agent.address);
      //   console.log(`The address for buyer`, buyer.address);
      //   console.log(`The address for seller`,seller.address);

      return { escrow, agent, buyer, seller, other };
    }

    it("Should initialize correctly", async () => {
      const { escrow, agent, buyer, seller } = await networkHelpers.loadFixture(
        deployEscrowFixture,
      );

      expect(await escrow.agent()).to.equal(agent.address);
      console.log("agent.address is: ", agent.address);

      expect(await escrow.buyer()).to.equal(buyer.address);
      console.log("buyer.address is: ", buyer.address);

      expect(await escrow.seller()).to.equal(seller.address);
      console.log("seller.address is: ", seller.address);

      expect(await escrow.status()).to.equal(0); // PENDING
    });

    it("Seller should fund escrow", async () => {
      const { escrow, seller } = await networkHelpers.loadFixture(
        deployEscrowFixture,
      );

      const amount = ethers.parseEther("1");

      await expect(escrow.connect(seller).fundEscrow({ value: amount }))
        .to.emit(escrow, "EscrowFunded")
        .withArgs(seller.address, amount);

      expect(await escrow.amountReceived()).to.equal(amount);
      expect(await escrow.status()).to.equal(1); // PAID
    });

    it("Buyer confirms delivery", async () => {
      const { escrow, seller, buyer } = await networkHelpers.loadFixture(
        deployEscrowFixture,
      );

      const amount = ethers.parseEther("1");

      await escrow.connect(seller).fundEscrow({ value: amount });

      await expect(escrow.connect(buyer).confirmDelivery())
        .to.emit(escrow, "DeliveryConfirmed")
        .withArgs(buyer.address);

      expect(await escrow.status()).to.equal(2); // AWAITING_CONFIRM
    });

    it("Agent releases funds to seller", async () => {
      const { escrow, seller, buyer, agent } = await networkHelpers.loadFixture(
        deployEscrowFixture,
      );

      const amount = ethers.parseEther("1");

      await escrow.connect(seller).fundEscrow({ value: amount });
      await escrow.connect(buyer).confirmDelivery();

      const sellerBalanceBefore = await ethers.provider.getBalance(seller);

      await expect(escrow.connect(agent).releaseFunds())
        .to.emit(escrow, "FundsReleased")
        .withArgs(seller.address, amount);

      const sellerBalanceAfter = await ethers.provider.getBalance(seller);

      expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
      expect(await escrow.status()).to.equal(3); // COMPLETE
    });

    it("Agent can refund buyer instead", async () => {
      const { escrow, seller, buyer, agent } = await networkHelpers.loadFixture(
        deployEscrowFixture,
      );

      const amount = ethers.parseEther("1");

      await escrow.connect(seller).fundEscrow({ value: amount });
      await escrow.connect(buyer).confirmDelivery();

      await expect(escrow.connect(agent).refundBuyer())
        .to.emit(escrow, "FundsRefunded")
        .withArgs(buyer.address, amount);

      expect(await escrow.status()).to.equal(3);
    });
  });

  describe("Access Control", function () {
    it("Non-seller cannot fund", async () => {
      const { escrow, buyer } = await networkHelpers.loadFixture(async () => {
        const base = await deployFactoryFixture();
        await base.factory
          .connect(base.buyer)
          .createEscrow(base.seller.address);
        const escrowAddress = await base.factory.getEscrow(0);
        const escrow = await base.factory.runner!.provider!.getContractAt?.(
          "Escrow",
          escrowAddress,
        );
        return { escrow, ...base };
      });

      await expect(
        escrow.connect(buyer).fundEscrow({ value: ethers.parseEther("1") }),
      ).to.be.revertedWith("Only seller allowed");
    });
  });
});

/*
import { expect } from "chai";
import { network } from "hardhat";

describe("Escrow + EscrowFactory", function () {
  let ethers: any;
  let networkHelpers: any;

    before(async () => {
      const connection = await network.connect();
      ethers = connection.ethers;
      networkHelpers = connection.networkHelpers;
    });

  async function deployFixture() {
    const [buyer, seller, other] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("EscrowFactory");
    const factory = await Factory.deploy();

    await factory.connect(buyer).createEscrow(seller.address);

    const escrowAddress = await factory.getEscrow(0);
    const escrow = await ethers.getContractAt("Escrow", escrowAddress);

    return { factory, escrow, buyer, seller, other };
  }

  describe("Factory", function () {
    it("Should create escrow and store it", async function () {
      const [buyer, seller] = await ethers.getSigners();

      const Factory = await ethers.getContractFactory("EscrowFactory");
      const factory = await Factory.deploy();

      await expect(factory.connect(buyer).createEscrow(seller.address)).to.emit(
        factory,
        "EscrowCreated",
      );

      expect(await factory.getEscrowCount()).to.equal(1);

      const escrowAddress = await factory.getEscrow(0);
      expect(escrowAddress).to.properAddress;
    });

    it("Should revert for invalid index", async function () {
      const Factory = await ethers.getContractFactory("EscrowFactory");
      const factory = await Factory.deploy();

      await expect(factory.getEscrow(0)).to.be.revertedWith(
        "Index is out of range",
      );
    });
  });

  describe("Escrow Initialization", function () {
    it("Should initialize correctly", async function () {
      const { escrow, factory, buyer, seller } = await loadFixture(
        deployFixture,
      );

      // IMPORTANT: agent = factory address (per your constructor)
      expect(await escrow.agent()).to.equal(await factory.getAddress());

      expect(await escrow.buyer()).to.equal(buyer.address);
      expect(await escrow.seller()).to.equal(seller.address);
      expect(await escrow.status()).to.equal(0); // PENDING
    });
  });

  describe("Escrow Workflow", function () {
    it("Seller should fund escrow", async function () {
      const { escrow, seller } = await loadFixture(deployFixture);

      const amount = ethers.parseEther("1");

      await expect(escrow.connect(seller).fundEscrow({ value: amount }))
        .to.emit(escrow, "EscrowFunded")
        .withArgs(seller.address, amount);

      expect(await escrow.amountReceived()).to.equal(amount);
      expect(await escrow.status()).to.equal(1); // PAID
    });

    it("Buyer confirms delivery", async function () {
      const { escrow, seller, buyer } = await loadFixture(deployFixture);

      const amount = ethers.parseEther("1");

      await escrow.connect(seller).fundEscrow({ value: amount });

      await expect(escrow.connect(buyer).confirmDelivery())
        .to.emit(escrow, "DeliveryConfirmed")
        .withArgs(buyer.address);

      expect(await escrow.status()).to.equal(2); // AWAITING_CONFIRM
    });

    it("Agent releases funds to seller", async function () {
      const { escrow, seller, buyer, factory } = await loadFixture(
        deployFixture,
      );

      const amount = ethers.parseEther("1");

      await escrow.connect(seller).fundEscrow({ value: amount });
      await escrow.connect(buyer).confirmDelivery();

      const sellerBalanceBefore = await ethers.provider.getBalance(
        seller.address,
      );

      // Agent = factory address
      await expect(
        escrow
          .connect(await ethers.getSigner(await factory.getAddress()))
          .releaseFunds(),
      )
        .to.emit(escrow, "FundsReleased")
        .withArgs(seller.address, amount);

      const sellerBalanceAfter = await ethers.provider.getBalance(
        seller.address,
      );

      expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
      expect(await escrow.status()).to.equal(3); // COMPLETE
    });

    it("Agent refunds buyer instead", async function () {
      const { escrow, seller, buyer, factory } = await loadFixture(
        deployFixture,
      );

      const amount = ethers.parseEther("1");

      await escrow.connect(seller).fundEscrow({ value: amount });
      await escrow.connect(buyer).confirmDelivery();

      await expect(
        escrow
          .connect(await ethers.getSigner(await factory.getAddress()))
          .refundBuyer(),
      )
        .to.emit(escrow, "FundsRefunded")
        .withArgs(buyer.address, amount);

      expect(await escrow.status()).to.equal(3);
    });
  });

  describe("Access Control", function () {
    it("Non-seller cannot fund", async function () {
      const { escrow, buyer } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(buyer).fundEscrow({
          value: ethers.parseEther("1"),
        }),
      ).to.be.revertedWith("Only seller allowed");
    });

    it("Non-buyer cannot confirm delivery", async function () {
      const { escrow, seller } = await loadFixture(deployFixture);

      await expect(escrow.connect(seller).confirmDelivery()).to.be.revertedWith(
        "Only buyer allowed",
      );
    });
  });
});
*/
