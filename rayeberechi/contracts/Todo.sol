// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Todo {
    uint256 public todoCounter;

    enum Status {
        Pending,   // 0
        Done,      // 1
        Cancelled, // 2
        Defaulted  // 3
    }

    struct TodoList {
        uint id;
        address owner;
        string text;
        Status status;
        uint deadline;        
    }

    mapping(uint => TodoList) public todos;

    // Added 'id' to event so we know which todo was created
    event TodoCreated(uint id, string text, uint deadline);
    event TodoStatusChanged(uint id, Status newStatus);

    function createTodo(string memory _text, uint _deadline) external returns(uint) {
        require(bytes(_text).length > 0, "Empty text");
        // Ensure deadline is in the future (at least 1 second)
        require(_deadline > block.timestamp, "Deadline must be in future"); 
        
        todoCounter++;

        todos[todoCounter] = TodoList({
            id: todoCounter,
            owner: msg.sender,
            text: _text,
            status: Status.Pending,
            deadline: _deadline
        });

        emit TodoCreated(todoCounter, _text, _deadline);
        return todoCounter;
    }

    function markAsDone(uint _id) external { 
        require(_id > 0 && _id <= todoCounter, "Invalid ID");
        TodoList storage todo = todos[_id];
        
        require(msg.sender == todo.owner, "Unauthorised Caller");
        require(todo.status == Status.Pending, "Not Pending");

        if (block.timestamp > todo.deadline) {
            todo.status = Status.Defaulted;
        } else {
            todo.status = Status.Done;
        }  
        
        emit TodoStatusChanged(_id, todo.status);
    }

    function cancelTodo(uint _id) external {
        require(_id > 0 && _id <= todoCounter, "Invalid ID");
        TodoList storage todo = todos[_id];

        require(msg.sender == todo.owner, "Unauthorised Caller");
        require(todo.status == Status.Pending, "Not Pending");

        todo.status = Status.Cancelled;
        emit TodoStatusChanged(_id, Status.Cancelled);
    }
}