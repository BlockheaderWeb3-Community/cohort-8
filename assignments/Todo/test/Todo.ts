//import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

const { time, loadFixture } = networkHelpers;

describe("TodoContract", function () {
  const TODO_TEXT = "Finish Solidity Project";
  const TEN_MINUTES = 600;

  async function deployTodoFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TodoContract = await ethers.getContractFactory("TodoContract");
    const todoContract = (await TodoContract.deploy()) as any;

    return { todoContract, owner, otherAccount };
  }

  describe("Creation", function () {
    it("Should create a todo with Pending status", async function () {
      const { todoContract, owner } = await loadFixture(deployTodoFixture);
      const deadline = (await time.latest()) + TEN_MINUTES + 100;

      await expect(todoContract.createTodo(TODO_TEXT, deadline))
        .to.emit(todoContract, "CreatedTodo")
        .withArgs(1, owner.address, TODO_TEXT, deadline);

      const todo = await todoContract.getTodo(1);
      expect(todo.text).to.equal(TODO_TEXT);
      expect(todo.status).to.equal(2); // Status.Pending
    });

    it("Should fail if deadline is too soon", async function () {
      const { todoContract } = await loadFixture(deployTodoFixture);
      const invalidDeadline = (await time.latest()) + 100; // Less than 600s

      await expect(todoContract.createTodo(TODO_TEXT, invalidDeadline))
        .to.be.revertedWith("Deadline must be at least 10 mins away");
    });
  });

  describe("Completion Logic (The State Machine)", function () {


    it("Should mark status as Done if completed before deadline", async function () {
      const { todoContract } = await loadFixture(deployTodoFixture);
      const deadline = (await time.latest()) + TEN_MINUTES + 1000;

      await todoContract.createTodo(TODO_TEXT, deadline);

      // Complete it immediately
      await todoContract.completeTodo(1);

      const todo = await todoContract.getTodo(1);
      expect(todo.status).to.equal(0); // Status.Done
    });

    it("Should mark status as Defaulted if completed after deadline", async function () {
      const { todoContract } = await loadFixture(deployTodoFixture);
      const deadline = (await time.latest()) + TEN_MINUTES + 500;

      await todoContract.createTodo(TODO_TEXT, deadline);

      // Fast forward time past the deadline
      await time.increaseTo(deadline + 1);

      await todoContract.completeTodo(1);

      const todo = await todoContract.getTodo(1);
      expect(todo.status).to.equal(1); // Status.Defaulted
    });
  });

  describe("Editing and Permissions", function () {
    it("Should allow the owner to edit a pending todo", async function () {
      const { todoContract } = await loadFixture(deployTodoFixture);
      const deadline = (await time.latest()) + TEN_MINUTES + 1000;
      await todoContract.createTodo(TODO_TEXT, deadline);

      const newText = "Updated Task";
      await todoContract.editTodo(1, newText, deadline + 100);

      const todo = await todoContract.getTodo(1);
      expect(todo.text).to.equal(newText);
    });

    it("Should fail if a non-owner tries to complete a todo", async function () {
      const { todoContract, otherAccount } = await loadFixture(deployTodoFixture);
      const deadline = (await time.latest()) + TEN_MINUTES + 1000;
      await todoContract.createTodo(TODO_TEXT, deadline);

      await expect(todoContract.connect(otherAccount).completeTodo(1))
        .to.be.revertedWith("Not the owner");
    });

    it("Should prevent editing a todo that is already completed", async function () {
      const { todoContract } = await loadFixture(deployTodoFixture);
      const deadline = (await time.latest()) + TEN_MINUTES + 1000;
      await todoContract.createTodo(TODO_TEXT, deadline);

      await todoContract.completeTodo(1);

      await expect(todoContract.editTodo(1, "New Text", deadline + 2000))
        .to.be.revertedWith("Cannot edit completed todos");
    });
  });

  describe("Getters", function () {
    it("Should correctly track user todo IDs", async function () {
      const { todoContract, owner } = await loadFixture(deployTodoFixture);
      const deadline = (await time.latest()) + TEN_MINUTES + 1000;

      await todoContract.createTodo("Task 1", deadline);
      await todoContract.createTodo("Task 2", deadline);

      const myIds = await todoContract.getMyTodoIds();
      expect(myIds.length).to.equal(2);
      expect(myIds[0]).to.equal(1n);
      expect(myIds[1]).to.equal(2n);
    });
  });
});
