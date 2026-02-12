import { expect } from "chai";

// These globals are injected by hardhat-toolbox-mocha-ethers at test runtime
declare global {
  var ethers: any;
  var time: any;
}

type SignerType = Awaited<ReturnType<typeof globalThis.ethers.getSigners>>[0];
type Todo = any; // Type will be inferred from ethers contract deployment

describe("Todo Contract", function () {
  let todo: Todo;
  let owner: SignerType;
  let addr1: SignerType;

  // Enums in Solidity map to integers in JS/TS
  const Status = {
    Pending: 0,
    Done: 1,
    Cancelled: 2,
    Defaulted: 3,
  };

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const TodoFactory = await ethers.getContractFactory("Todo");
    todo = (await TodoFactory.deploy()) as Todo;
  });

  describe("Deployment", function () {
    it("Should set the initial todoCounter to 0", async function () {
      expect(await todo.todoCounter()).to.equal(0);
    });
  });

  describe("createTodo", function () {
    it("Should create a task and emit an event", async function () {
      const text = "Finish TypeScript Tests";
      const deadline = (await time.latest()) + 3600; // 1 hour from now

      await expect(todo.createTodo(text, deadline))
        .to.emit(todo, "TodoCreated")
        .withArgs(1, owner.address, text, deadline);

      const task = await todo.getTodo(1);
      expect(task.text).to.equal(text);
      expect(task.owner).to.equal(owner.address);
      expect(task.status).to.equal(Status.Pending);
    });

    it("Should revert if text is empty", async function () {
      const deadline = (await time.latest()) + 3600;
      await expect(todo.createTodo("", deadline))
        .to.be.revertedWith("Empty text");
    });
  });

  describe("markAsDone", function () {
    let deadline: number;

    beforeEach(async function () {
      deadline = (await time.latest()) + 3600;
      await todo.createTodo("Task to complete", deadline);
    });

    it("Should mark as Done if within deadline", async function () {
      await todo.markAsDone(1);
      const task = await todo.getTodo(1);
      expect(task.status).to.equal(Status.Done);
    });

    it("Should mark as Defaulted if deadline passed", async function () {
      // Fast-forward time in the local Hardhat node
      await time.increaseTo(deadline + 1);

      await todo.markAsDone(1);
      const task = await todo.getTodo(1);
      expect(task.status).to.equal(Status.Defaulted);
    });

    it("Should prevent non-owners from marking as done", async function () {
      await expect(todo.connect(addr1).markAsDone(1))
        .to.be.revertedWith("Unauthorized");
    });
  });
});