// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.31;


contract Todo {

    uint256 todoCounter;
    uint256 private constant dnaDigits = 16;
    uint256 private constant dnaModulus = 10 ** dnaDigits;
    

    enum Status {
        PENDING,
        DEFAULTED,
        CANCELLED,
        COMPLETED
    }

    struct  TodoL {
        uint id;
        address owner;
        string content;
        Status status;
        uint256 deadline;
    }

    modifier onlyOwner() {
        require(msg.sender != address(0), "Invalid caller");
        _;
    }

    mapping(uint => TodoL) public todos;
    event TodoCreated(string text, uint deadline);

    function _generateRandomDna(string memory _str) private pure returns (uint256) {
        uint256 rand = uint256(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function  createTodo(string memory _text, uint256 _deadline) external returns (uint) {
        require(bytes(_text).length > 0, "Todo content cannot be empty");
        require(_deadline > (block.timestamp + 600), "Deadline should be in the future");
        require(msg.sender != address(0), "Invalid address");

        
        todoCounter++;
        todos[todoCounter] = TodoL(todoCounter, msg.sender, _text, Status.PENDING, _deadline);

        emit TodoCreated(_text, _deadline);
        return todoCounter;   
    }

    function getTodo(uint _id) external view returns (TodoL memory) {
        return todos[_id];
    }

    function doneTodo(uint _id) external onlyOwner {
        TodoL storage todo = todos[_id]; //memory local varaiable  //storage reference variable 
        require(_id > 0 && _id <= todoCounter, "Todo does not exist");
        require(todo.owner == msg.sender, "Only the owner can mark the todo as done");
        require(todo.status == Status.PENDING, "Only pending todos can be marked as done");


        if(block.timestamp > todo.deadline) {
            todo.status = Status.DEFAULTED;
        } else {
        todo.status = Status.COMPLETED;
    }
    }
}
