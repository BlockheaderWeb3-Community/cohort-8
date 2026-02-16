import { expect } from "chai";
import { network } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { Contract } from "ethers";

const { ethers } = await network.connect();

describe("TodoFactory + TodoList", function () {
  async function deployFactoryFixture() {
    const [owner, user2, user3] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("TodoFactory");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();
    return { factory, owner, user2, user3 };
  }

  async function createUserList(factory: Contract, signer: HardhatEthersSigner) {
    const tx = await factory.connect(signer).createTodoList();
    await tx.wait();
    const myLists = await factory.connect(signer).getMyTodoLists();
    const listAddress = myLists[myLists.length - 1] as string;
    const list = await ethers.getContractAt("TodoList", listAddress, signer);
    return { list, listAddress };
  }

  it("creates a todo list per user and tracks addresses", async function () {
    const { factory, owner, user2 } = await deployFactoryFixture();

    const { listAddress: ownerListAddress } = await createUserList(factory, owner);
    const { listAddress: user2ListAddress } = await createUserList(factory, user2);

    expect(await factory.totalTodoLists()).to.equal(2n);

    const all = await factory.getAllTodoLists();
    expect(all[0]).to.equal(ownerListAddress);
    expect(all[1]).to.equal(user2ListAddress);

    const ownerLists = await factory.getTodoListsByUser(owner.address);
    const user2Lists = await factory.getTodoListsByUser(user2.address);
    expect(ownerLists.length).to.equal(1);
    expect(user2Lists.length).to.equal(1);
  });

  it("sets list owner to creator", async function () {
    const { factory, owner } = await deployFactoryFixture();
    const { list } = await createUserList(factory, owner);
    expect(await list.owner()).to.equal(owner.address);
  });

  it("allows owner to add and read todos", async function () {
    const { factory, owner } = await deployFactoryFixture();
    const { list } = await createUserList(factory, owner);

    await expect(list.addTodo("Learn Solidity")).to.emit(list, "TodoAdded");

    expect(await list.totalTodos()).to.equal(1n);

    const todo = await list.getTodo(0);
    expect(todo.text).to.equal("Learn Solidity");
    expect(todo.completed).to.equal(false);
    expect(todo.deleted).to.equal(false);
  });

  it("handles update, completion and deletion lifecycle", async function () {
    const { factory, owner } = await deployFactoryFixture();
    const { list } = await createUserList(factory, owner);

    await list.addTodo("Initial");
    await list.updateTodoText(0, "Updated");
    await list.setTodoCompleted(0, true);
    await list.deleteTodo(0);

    const todo = await list.getTodo(0);
    expect(todo.text).to.equal("Updated");
    expect(todo.completed).to.equal(true);
    expect(todo.deleted).to.equal(true);
  });

  it("reverts when non-owner tries to mutate todos", async function () {
    const { factory, owner, user2 } = await deployFactoryFixture();
    const { list } = await createUserList(factory, owner);
    await list.addTodo("Owner item");

    await expect(list.connect(user2).addTodo("Hack")).to.be.revertedWith(
      "Only owner can call this"
    );
    await expect(list.connect(user2).updateTodoText(0, "Hack")).to.be.revertedWith(
      "Only owner can call this"
    );
    await expect(list.connect(user2).setTodoCompleted(0, true)).to.be.revertedWith(
      "Only owner can call this"
    );
    await expect(list.connect(user2).deleteTodo(0)).to.be.revertedWith(
      "Only owner can call this"
    );
  });

  it("reverts for invalid todo operations", async function () {
    const { factory, owner } = await deployFactoryFixture();
    const { list } = await createUserList(factory, owner);

    await expect(list.addTodo("")).to.be.revertedWith("Text cannot be empty");
    await expect(list.getTodo(0)).to.be.revertedWith("Todo does not exist");

    await list.addTodo("Task");
    await expect(list.updateTodoText(0, "")).to.be.revertedWith("Text cannot be empty");
    await expect(list.deleteTodo(1)).to.be.revertedWith("Todo does not exist");
    await list.deleteTodo(0);
    await expect(list.deleteTodo(0)).to.be.revertedWith("Todo already deleted");
    await expect(list.updateTodoText(0, "after delete")).to.be.revertedWith("Todo is deleted");
    await expect(list.setTodoCompleted(0, false)).to.be.revertedWith("Todo is deleted");
  });
});
