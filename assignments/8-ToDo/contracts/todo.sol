// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Todo {
   uint todoCounter;

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
    uint deadline;
   }

   mapping (uint => TodoList) todos;

   event TodoCreated(string text, uint deadline);
   event MarkTodoAsDone(string text, Status status);

   function createTodo(string memory _text, uint _deadline) external returns (uint) {
    require(bytes(_text).length > 0, "Empty text");
    require(_deadline > (block.timestamp + 600), "Invalid deadline");
    require(msg.sender != address(0), "Zero Address Used");

    todoCounter++;
    todos[todoCounter] = TodoList(todoCounter, msg.sender, _text, Status.Pending, _deadline);

    emit TodoCreated(_text, _deadline);

    return todoCounter;
   }

   function markAsDone(uint _id) external returns(bool){
    require((_id > 0) && (_id <= todoCounter), "Invalid id");
    require(todos[_id].owner == msg.sender, "Unauthorized");
    require(todos[_id].status == Status.Pending, "Not Pending");

    if(block.timestamp > todos[_id].deadline){
        todos[_id].status = Status.Defaulted;
        return false;
    }
    todos[_id].status = Status.Done;
    emit MarkTodoAsDone(todos[_id].text, Status.Done);
    return true;
   }

   function updateTodo(uint _id) external returns (bool) {
    require((_id > 0) && (_id <= todoCounter), "Invalid id");
   }
}
