// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract TodoContract {
    enum Status {
        Done,
        Defaulted,
        Pending
    }

    struct Todo {
        uint256 id;
        address owner;
        string text;
        Status status;
        uint256 deadline;
    }

    // State Variables
    uint256 private todoCounter;
    mapping(uint256 => Todo) public todos;
    // Maps user address to a list of their Todo IDs
    mapping(address => uint256[]) private userTodoIds;

    // Events
    event CreatedTodo(uint256 indexed id, address indexed owner, string text, uint256 deadline);
    event StatusUpdated(uint256 indexed id, Status newStatus);
    event TodoEdited(uint256 indexed id, string newText, uint256 newDeadline);
    event TodoDeleted(uint256 indexed id, address indexed owner);

    // Modifiers
    modifier onlyTodoOwner(uint256 _id) {
        require(todos[_id].owner == msg.sender, "Not the owner");
        _;
    }

    modifier exists(uint256 _id) {
        require(_id > 0 && _id <= todoCounter, "Todo does not exist");
        require(todos[_id].owner != address(0), "Todo was deleted");
        _;
    }

   function createTodo(string calldata _text, uint256 _deadline) external returns (uint256) {
        require(bytes(_text).length > 0, "Empty text");
        require(_deadline > block.timestamp + 600, "Deadline must be at least 10 mins away");

        todoCounter++;
        
        todos[todoCounter] = Todo({
            id: todoCounter,
            owner: msg.sender,
            text: _text,
            status: Status.Pending,
            deadline: _deadline
        });

        userTodoIds[msg.sender].push(todoCounter);

        emit CreatedTodo(todoCounter, msg.sender, _text, _deadline);
        return todoCounter;
    }
   function completeTodo(uint256 _id) external exists(_id) onlyTodoOwner(_id) {
        Todo storage todo = todos[_id];
        require(todo.status == Status.Pending, "Todo is already finalized");

        if (block.timestamp > todo.deadline) {
            todo.status = Status.Defaulted;
        } else {
            todo.status = Status.Done;
        }

        emit StatusUpdated(_id, todo.status);
    }
   function editTodo(uint256 _id, string calldata _newText, uint256 _newDeadline) 
        external 
        exists(_id) 
        onlyTodoOwner(_id) 
    {
        Todo storage todo = todos[_id];
        require(todo.status == Status.Pending, "Cannot edit completed todos");
        require(bytes(_newText).length > 0, "Text cannot be empty");
        require(_newDeadline > block.timestamp + 600, "New deadline too soon");

        todo.text = _newText;
        todo.deadline = _newDeadline;

        emit TodoEdited(_id, _newText, _newDeadline);
    }
   function getMyTodoIds() external view returns (uint256[] memory) {
        return userTodoIds[msg.sender];
    }
   function getTodo(uint256 _id) external view exists(_id) returns (Todo memory) {
        return todos[_id];
    }
   function getTotalTodoCount() external view returns (uint256) {
        return todoCounter;
    }
}
