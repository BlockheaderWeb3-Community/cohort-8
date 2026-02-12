// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Todo {
    uint256 public todoCounter;

    enum Status {
        Pending,
        Done,
        Cancelled,
        Defaulted
    }

    struct TodoList {
        uint256 id;
        address owner;
        string text;
        Status status;
        uint256 deadline;
    }

    mapping(uint256 => TodoList) private todos;

    event TodoCreated(uint256 indexed id, address indexed owner, string text, uint256 deadline);
    event TodoStatusChanged(uint256 indexed id, Status newStatus);
    event TodoUpdated(uint256 indexed id, string newText);

    function createTodo(string calldata _text, uint256 _deadline) external returns (uint256) {
        require(bytes(_text).length > 0, "Empty text");
        require(_deadline > block.timestamp + 600, "Deadline must be > 10 mins");

        todoCounter++;

        todos[todoCounter] = TodoList({
            id: todoCounter,
            owner: msg.sender,
            text: _text,
            status: Status.Pending,
            deadline: _deadline
        });

        emit TodoCreated(todoCounter, msg.sender, _text, _deadline);
        return todoCounter;
    }

    function markAsDone(uint256 _id) external {
        require(_id > 0 && _id <= todoCounter, "Invalid ID");
        TodoList storage todo = todos[_id];
        
        require(msg.sender == todo.owner, "Unauthorized");
        require(todo.status == Status.Pending, "Task not active");

        if (block.timestamp > todo.deadline) {
            todo.status = Status.Defaulted;
        } else {
            todo.status = Status.Done;
        }

        emit TodoStatusChanged(_id, todo.status);
    }

    // --- Added Functions ---

    function updateTodoText(uint256 _id, string calldata _newText) external {
        require(_id > 0 && _id <= todoCounter, "Invalid ID");
        TodoList storage todo = todos[_id];

        require(msg.sender == todo.owner, "Unauthorized");
        require(todo.status == Status.Pending, "Cannot edit finished task");
        require(bytes(_newText).length > 0, "Empty text");

        todo.text = _newText;
        emit TodoUpdated(_id, _newText);
    }

    function cancelTodo(uint256 _id) external {
        require(_id > 0 && _id <= todoCounter, "Invalid ID");
        TodoList storage todo = todos[_id];

        require(msg.sender == todo.owner, "Unauthorized");
        require(todo.status == Status.Pending, "Task not active");

        todo.status = Status.Cancelled;
        emit TodoStatusChanged(_id, Status.Cancelled);
    }

    function getTodo(uint256 _id) external view returns (TodoList memory) {
        require(_id > 0 && _id <= todoCounter, "Invalid ID");
        return todos[_id];
    }
}