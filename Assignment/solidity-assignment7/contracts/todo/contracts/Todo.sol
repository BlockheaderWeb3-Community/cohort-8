// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Todo {
  uint public todoCounter;

  enum TaskState {
    Pending,
    Completed,
    Cancelled,
    Defaulted
  }

  struct Task {
    uint id;
    address admin;
    string text;
    TaskState status;
    uint deadline;
  }

  mapping(uint => Task) tasks;
  event TaskCreated(string text, uint deadline);

  function createTask(
    string memory text,
    uint deadline
  ) external returns (uint) {
    require(bytes(text).length > 0, 'Text cannot be empty');
    require(deadline > (block.timestamp + 600), 'Invalid deadline');

    todoCounter++;

    tasks[todoCounter] = Task(
      todoCounter,
      msg.sender,
      text,
      TaskState.Pending,
      deadline
    );

    emit TaskCreated(text, deadline);
    return todoCounter;
  }

  function getTask(uint id) external view returns (Task memory) {
    return tasks[id];
  }

  function updateTask(
    uint id,
    string memory text,
    uint deadline
  ) external returns (uint) {
    require(bytes(text).length > 0, 'Text cannot be empty');
    require(
      deadline > (block.timestamp + 600),
      'Deadline cannot be less than 10 minutes'
    );
    require(tasks[id].admin == msg.sender, 'Only admin can update task');
    tasks[id] = Task(id, msg.sender, text, TaskState.Pending, deadline);
    return id;
  }

  function doneTask(uint id) external returns (uint) {
    require(tasks[id].admin == msg.sender, 'Only admin can complete task');
    tasks[id].status = TaskState.Completed;
    return id;
  }
}
