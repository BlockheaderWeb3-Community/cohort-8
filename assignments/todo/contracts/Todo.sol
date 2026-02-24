// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;
contract Todo{
    uint256 todoCounter;

    enum Status{
        Pending,
        Done,
        Cancelled,
        Defaulted
    }

    struct TodoList{
        uint id;
        address owner;
        string text;
        Status status;
        uint256 deadline;
    }

    mapping(uint => TodoList) todos;

    event TodoCreated(string text, uint deadline);



function createTodo(string memory _text, uint _deadline) external returns(uint){
    require(bytes(_text).length > 0, "Empty text");
    require(_deadline > (block.timestamp + 600), "Invalid deadline");
    require(msg.sender != address(0), "Zero address");

    todoCounter++;

    todos[todoCounter] = TodoList(todoCounter, msg.sender, _text, Status.Pending, _deadline);

    emit TodoCreated(_text, _deadline);
    return todoCounter;    
}

function markAsDone(uint _id) external {
    require((_id > 0) && (_id <= todoCounter) , 'invalid id');
    TodoList storage todo = todos[_id];
    require(todo.status == Status.Pending, "Not pending");
    require(msg.sender == todo.owner, "unauthorized Caller");

    if(block.timestamp > todo.deadline){
        todo.status = Status.Defaulted;
    }
    else{
    todo.status = Status.Done;
    }

}

}