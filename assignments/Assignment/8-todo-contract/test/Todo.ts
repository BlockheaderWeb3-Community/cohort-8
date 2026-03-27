import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Todo", function () {
  async function deployTodoFixture() {
    const [owner, otherUser] = await ethers.getSigners();
    const todo = await ethers.deployContract("Todo");
    await todo.waitForDeployment();
    return { todo, owner, otherUser };
  }

  it("creates a todo and saves the right data", async function () {
    const { todo, owner } = await deployTodoFixture();
    const latestBlock = await ethers.provider.getBlock("latest");
    const deadline = Number(latestBlock!.timestamp) + 3600;

    await todo.createTodo("Study Solidity", deadline);
    const savedTodo = await todo.getTodo(1);

    expect(savedTodo.id).to.equal(1n);
    expect(savedTodo.owner).to.equal(owner.address);
    expect(savedTodo.content).to.equal("Study Solidity");
    expect(savedTodo.status).to.equal(0n); // PENDING
    expect(savedTodo.deadline).to.equal(BigInt(deadline));
  });

  it("reverts when todo content is empty", async function () {
    const { todo } = await deployTodoFixture();
    const latestBlock = await ethers.provider.getBlock("latest");
    const deadline = Number(latestBlock!.timestamp) + 3600;

    await expect(todo.createTodo("", deadline)).to.be.revertedWith(
      "Todo content cannot be empty",
    );
  });

  it("reverts when deadline is too soon", async function () {
    const { todo } = await deployTodoFixture();
    const latestBlock = await ethers.provider.getBlock("latest");
    const invalidDeadline = Number(latestBlock!.timestamp) + 500;

    await expect(
      todo.createTodo("This should fail", invalidDeadline),
    ).to.be.revertedWith("Deadline should be in the future");
  });

  it("marks todo as COMPLETED when done before deadline", async function () {
    const { todo } = await deployTodoFixture();
    const latestBlock = await ethers.provider.getBlock("latest");
    const deadline = Number(latestBlock!.timestamp) + 3600;

    await todo.createTodo("Finish assignment", deadline);
    await todo.doneTodo(1);
    const savedTodo = await todo.getTodo(1);

    expect(savedTodo.status).to.equal(3n); // COMPLETED
  });

  it("reverts when non-owner tries to mark todo as done", async function () {
    const { todo, otherUser } = await deployTodoFixture();
    const latestBlock = await ethers.provider.getBlock("latest");
    const deadline = Number(latestBlock!.timestamp) + 3600;

    await todo.createTodo("Owner only action", deadline);

    await expect(todo.connect(otherUser).doneTodo(1)).to.be.revertedWith(
      "Only the owner can mark the todo as done",
    );
  });

  it("marks todo as DEFAULTED when completed after deadline", async function () {
    const { todo } = await deployTodoFixture();
    const latestBlock = await ethers.provider.getBlock("latest");
    const deadline = Number(latestBlock!.timestamp) + 700;

    await todo.createTodo("Late task", deadline);
    await ethers.provider.send("evm_increaseTime", [800]);
    await ethers.provider.send("evm_mine", []);

    await todo.doneTodo(1);
    const savedTodo = await todo.getTodo(1);

    expect(savedTodo.status).to.equal(1n); // DEFAULTED
  });

  it("reverts when todo id does not exist", async function () {
    const { todo } = await deployTodoFixture();
    await expect(todo.doneTodo(1)).to.be.revertedWith("Todo does not exist");
  });
});
