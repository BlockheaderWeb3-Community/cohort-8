// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract Todo {
    uint256 todoCounter;

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

    mapping(uint => TodoList) public todos;
    mapping(address => uint[]) public userTodos;

    event TodoCreated(uint indexed id, address indexed owner, string text, uint deadline);
    event TodoStatusUpdated(uint indexed id, Status status);
    event TodoDeleted(uint indexed id);

    function createTodo(string memory _text, uint _deadline) external returns(uint) {
        require(bytes(_text).length > 0, "Empty text");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_deadline <= block.timestamp + 365 days, "Deadline too far");
        require(msg.sender != address(0), "Zero address");

        todoCounter++;

        todos[todoCounter] = TodoList({
            id: todoCounter,
            owner: msg.sender,
            text: _text,
            status: Status.Pending,
            deadline: _deadline
        });

        userTodos[msg.sender].push(todoCounter);

        emit TodoCreated(todoCounter, msg.sender, _text, _deadline);
        return todoCounter;
    }

    function markAsDone(uint _id) external {
        require(_id > 0 && _id <= todoCounter, "Invalid id");
        TodoList storage todo = todos[_id];
        require(todo.status == Status.Pending, "Not pending");
        require(msg.sender == todo.owner, "Unauthorized caller");

        if (block.timestamp > todo.deadline) {
            todo.status = Status.Defaulted;
        } else {
            todo.status = Status.Done;
        }

        emit TodoStatusUpdated(_id, todo.status);
    }

    function cancelTodo(uint _id) external {
        require(_id > 0 && _id <= todoCounter, "Invalid id");
        TodoList storage todo = todos[_id];
        require(todo.status == Status.Pending, "Todo not pending");
        require(msg.sender == todo.owner, "Unauthorized caller");

        todo.status = Status.Cancelled;
        emit TodoStatusUpdated(_id, Status.Cancelled);
    }

    function deleteTodo(uint _id) external {
        require(_id > 0 && _id <= todoCounter, "Invalid id");
        TodoList storage todo = todos[_id];
        require(msg.sender == todo.owner, "Unauthorized caller");
        require(todo.status != Status.Pending, "Cannot delete pending todo");

        delete todos[_id];
        emit TodoDeleted(_id);
    }

    function getTodo(uint _id) external view returns (TodoList memory) {
        require(_id > 0 && _id <= todoCounter, "Invalid id");
        return todos[_id];
    }

    function getUserTodos(address _user) external view returns (uint[] memory) {
        return userTodos[_user];
    }

    function getUserTodoCount(address _user) external view returns (uint) {
        return userTodos[_user].length;
    }

    function getTodosByStatus(address _user, Status _status) external view returns (uint[] memory) {
        uint[] memory userTodoIds = userTodos[_user];
        uint count = 0;
        
        // First count matching todos
        for (uint i = 0; i < userTodoIds.length; i++) {
            if (todos[userTodoIds[i]].status == _status) {
                count++;
            }
        }
        
        // Then populate array
        uint[] memory filteredTodos = new uint[](count);
        uint index = 0;
        for (uint i = 0; i < userTodoIds.length; i++) {
            if (todos[userTodoIds[i]].status == _status) {
                filteredTodos[index] = userTodoIds[i];
                index++;
            }
        }
        
        return filteredTodos;
    }

    function updateDeadline(uint _id, uint _newDeadline) external {
        require(_id > 0 && _id <= todoCounter, "Invalid id");
        TodoList storage todo = todos[_id];
        require(msg.sender == todo.owner, "Unauthorized caller");
        require(todo.status == Status.Pending, "Only pending todos can be updated");
           require(_newDeadline > block.timestamp, "New deadline must be in the future");
        
        todo.deadline = _newDeadline;
    }
}