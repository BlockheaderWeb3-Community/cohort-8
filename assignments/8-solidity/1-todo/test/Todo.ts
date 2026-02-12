import { expect } from "chai";
import { network } from "hardhat";


const { ethers, networkHelpers } = await network.connect();

describe('Todo Contract', function () {
  let todo: any;
  let owner: any;
  let addr1: any;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();

    todo = await ethers.deployContract('Todo');
    await todo.waitForDeployment();
  });

  describe('createTodo', () => {
    it('Should create a todo and emit TodoCreated', async () => {
      const now = await networkHelpers.time.latest();
      const deadline = now + 1000;

      await expect(todo.createTodo('My first task', deadline))
        .to.emit(todo, 'TodoCreated')
        .withArgs('My first task', deadline);

      const todoData = await todo.todos(1);
      expect(todoData.text).to.equal('My first task');
      expect(todoData.owner).to.equal(owner.address);
      expect(todoData.status).to.equal(0); 
    });

    it('Should fail if text is empty', async function () {
      const now = await networkHelpers.time.latest();
      const deadline = now + 1000;

      await expect(todo.createTodo('', deadline)).to.be.revertedWith(
        'Empty text'
      );
    });

    it('Should fail if deadline is too soon', async function () {
      const now = await networkHelpers.time.latest();
      const deadline = now + 100;

      await expect(todo.createTodo('Test', deadline)).to.be.revertedWith(
        'Invalid deadline'
      );
    });
  });

  describe('updateTodo', function () {
    beforeEach(async function () {
      const now = await networkHelpers.time.latest();
      const deadline = now + 1000; 
      await todo.createTodo('Task to complete', deadline);
    });

    it('Should mark todo as Done if before deadline', async () => {
      await new Promise((res) => setTimeout(res, 1000));

      await todo.updateTodo(1);
      const todoData = await todo.todos(1);
      expect(todoData.status).to.equal(1);
    });

    // it('Should mark todo as Defaulted if after deadline', async () => {
    //   await new Promise((res) => setTimeout(res, 3000));

    //   await todo.updateTodo(1);
    //   const todoData = await todo.todos(1);
    //   expect(todoData.status).to.equal(3); 
    // });

    it('Should revert if caller is not owner', async () => {
      await expect(todo.connect(addr1).updateTodo(1)).to.be.revertedWith(
        'Unauthorized Caller'
      );
    });

    it('Should revert if todo is not pending', async () => {
      await todo.updateTodo(1);

      await expect(todo.updateTodo(1)).to.be.revertedWith('Not pending');
    });

    it('Should revert if id is invalid', async () => {
      await expect(todo.updateTodo(0)).to.be.revertedWith('Invalid id');
      await expect(todo.updateTodo(999)).to.be.revertedWith('Invalid id');
    });
  });
});


