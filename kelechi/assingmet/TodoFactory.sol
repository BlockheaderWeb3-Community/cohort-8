// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TodoList {
    struct Todo {
        string text;
        bool completed;
        bool deleted;
        uint256 createdAt;
        uint256 updatedAt;
    }

    address public immutable owner;
    uint256 private _todoCount;
    mapping(uint256 => Todo) private _todos;

    event TodoAdded(uint256 indexed todoId, string text, uint256 timestamp);
    event TodoUpdated(uint256 indexed todoId, string newText, uint256 timestamp);
    event TodoCompleted(uint256 indexed todoId, bool completed, uint256 timestamp);
    event TodoDeleted(uint256 indexed todoId, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(address _owner) {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
    }

    function addTodo(string calldata text) external onlyOwner returns (uint256 todoId) {
        require(bytes(text).length > 0, "Text cannot be empty");

        todoId = _todoCount;
        _todos[todoId] = Todo({
            text: text,
            completed: false,
            deleted: false,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _todoCount++;
        emit TodoAdded(todoId, text, block.timestamp);
    }

    function updateTodoText(uint256 todoId, string calldata newText) external onlyOwner {
        require(todoId < _todoCount, "Todo does not exist");
        require(bytes(newText).length > 0, "Text cannot be empty");

        Todo storage todo = _todos[todoId];
        require(!todo.deleted, "Todo is deleted");

        todo.text = newText;
        todo.updatedAt = block.timestamp;
        emit TodoUpdated(todoId, newText, block.timestamp);
    }

    function setTodoCompleted(uint256 todoId, bool completed) external onlyOwner {
        require(todoId < _todoCount, "Todo does not exist");

        Todo storage todo = _todos[todoId];
        require(!todo.deleted, "Todo is deleted");

        todo.completed = completed;
        todo.updatedAt = block.timestamp;
        emit TodoCompleted(todoId, completed, block.timestamp);
    }

    function deleteTodo(uint256 todoId) external onlyOwner {
        require(todoId < _todoCount, "Todo does not exist");

        Todo storage todo = _todos[todoId];
        require(!todo.deleted, "Todo already deleted");

        todo.deleted = true;
        todo.updatedAt = block.timestamp;
        emit TodoDeleted(todoId, block.timestamp);
    }

    function getTodo(uint256 todoId) external view returns (Todo memory todo) {
        require(todoId < _todoCount, "Todo does not exist");
        todo = _todos[todoId];
    }

    function totalTodos() external view returns (uint256) {
        return _todoCount;
    }
}

contract TodoFactory {
    mapping(address => address[]) private _userTodoLists;
    address[] private _allTodoLists;

    event TodoListCreated(address indexed creator, address indexed todoList, uint256 userListCount);

    function createTodoList() external returns (address todoListAddress) {
        TodoList todoList = new TodoList(msg.sender);
        todoListAddress = address(todoList);

        _userTodoLists[msg.sender].push(todoListAddress);
        _allTodoLists.push(todoListAddress);

        emit TodoListCreated(msg.sender, todoListAddress, _userTodoLists[msg.sender].length);
    }

    function getMyTodoLists() external view returns (address[] memory) {
        return _userTodoLists[msg.sender];
    }

    function getTodoListsByUser(address user) external view returns (address[] memory) {
        return _userTodoLists[user];
    }

    function getAllTodoLists() external view returns (address[] memory) {
        return _allTodoLists;
    }

    function totalTodoLists() external view returns (uint256) {
        return _allTodoLists.length;
    }
}
