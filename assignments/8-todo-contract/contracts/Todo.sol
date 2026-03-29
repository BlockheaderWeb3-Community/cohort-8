// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.31;

contract Todo {
  uint256 public todoCounter;
  enum Status {
    PENDING,
    DEFAULTED,
    CANCELLED,
    COMPLETED
  }
  struct Item {
    uint256 id;
    address owner;
    string content;
    Status status;
    uint256 deadline;
  }
  mapping(uint256 => Item) public todos;
  event TodoCreated(
    uint256 id,
    address indexed owner,
    string content,
    uint256 deadline
  );
  event TodoUpdated(uint256 id, Status status);

  modifier validTodo(uint256 id) {
    require(id > 0 && id <= todoCounter, 'Todo does not exist');
    _;
  }
  modifier onlyTodoOwner(uint256 id) {
    require(todos[id].owner == msg.sender, 'Only todo owner');
    _;
  }

  function createTodo(
    string memory text,
    uint256 deadline
  ) external returns (uint256) {
    require(bytes(text).length > 0, 'Empty content');
    require(deadline > block.timestamp + 600, 'Deadline too soon');
    todoCounter++;
    todos[todoCounter] = Item(
      todoCounter,
      msg.sender,
      text,
      Status.PENDING,
      deadline
    );
    emit TodoCreated(todoCounter, msg.sender, text, deadline);
    return todoCounter;
  }

  function doneTodo(uint256 id) external validTodo(id) onlyTodoOwner(id) {
    Item storage t = todos[id];
    require(t.status == Status.PENDING, 'Todo not pending');
    t.status = block.timestamp > t.deadline
      ? Status.DEFAULTED
      : Status.COMPLETED;
    emit TodoUpdated(id, t.status);
  }

  function cancelTodo(uint256 id) external validTodo(id) onlyTodoOwner(id) {
    Item storage t = todos[id];
    require(t.status == Status.PENDING, 'Todo not pending');
    t.status = Status.CANCELLED;
    emit TodoUpdated(id, Status.CANCELLED);
  }

  function getTodo(
    uint256 id
  ) external view validTodo(id) returns (Item memory) {
    return todos[id];
  }
}
