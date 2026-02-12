// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Add{
  function add(uint a, uint b) public pure returns(uint) {
    uint c = a + b;
    return c;
  }
}

contract Average is Add {
  function average(uint a, uint b) public pure returns(uint) {
    uint d = add(a,b) / 2;

    return d;
  }
}

contract Todo {
  uint256 public todoCounter;

  enum Status {
    Pending,
    Done,
    Cancelled,
    Defaulted
  }

  struct TodoList {
    uint id;
    address owner;
    string text;
    Status status;
    uint256 deadline;
  }

  mapping(uint256 => TodoList) public todos;

  event TodoCreated(string text, uint deadline);
  event TodoUpdated(uint256 id, Status status);

  function createTodo(string memory text, uint deadline) external returns(uint) {
    require(bytes(text).length > 0, "Empty text");
    require(deadline > block.timestamp + 600, "Invalid deadline");

    todoCounter++;

    todos[todoCounter] = TodoList({
        id: todoCounter,
        owner: msg.sender,
        text: text,
        status: Status.Pending,
        deadline: deadline
    });

    emit TodoCreated(text, deadline);
    return todoCounter;
  }

  function updateTodo(uint _id) external {
    require((_id > 0) && (_id <= todoCounter), "Invalid id");
    TodoList storage todo = todos[_id];
    require(todo.status == Status.Pending, "Not pending");
    require(msg.sender == todo.owner, "Unauthorized Caller");

    if(block.timestamp > todo.deadline){
      todo.status = Status.Defaulted;
    } else {
      todo.status = Status.Done;
    }
  }

}
