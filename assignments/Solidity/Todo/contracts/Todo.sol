// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Add{
    function add(uint a, uint b) public pure returns(uint) {
        uint c = a + b;
        return c;
    }
}

contract Average is Add {
    function avergae(uint a, uint b) public pure returns(uint) {

    }
}















contract Todo {
    uint256 public todoCounter;

    struct TodoList{
        uint256 id;
        address owner;
        string text;
        Status status;
        uint256 deadline;
    }

    enum Status{
        Pending,
        Done,
        Cancelled,
        Defaulted
    }

    mapping (uint => TodoList) todos;

    event TodoCreated(string text, uint deadline);

    function createTodo(string memory _text, uint deadline) external returns(uint) {
        require(bytes(_text).length > 0, "Empty text");
        require((deadline > block.timestamp + 600), "Invalid deadline");

        todoCounter++;

        todos[todoCounter] = TodoList(todoCounter, msg.sender, _text, Status.Pending, deadline);

        emit TodoCreated(_text, deadline);
        return todoCounter;
    }

    function markAsDone(uint _id) external {
        require((_id > 0) && (_id <= todoCounter), "Invalid id");
        TodoList memory todo = todos[_id];
        require((todo.status == Status.Pending), "Not pending");
        
        if (block.timestamp > todo.deadline) {
            todo.status = Status.Cancelled;
        }else {
            todo.status = Status.Done;
        }

        todos[_id] = todo;
    }
}