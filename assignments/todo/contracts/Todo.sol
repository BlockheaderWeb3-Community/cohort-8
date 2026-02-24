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
    mapping(address => uint[]) userTodoIds;

    event TodoCreated(string text, uint deadline);
    event TodoMarkedDone(uint id);
    event TodoCancelled(uint id);
    event TodoUpdated(uint id, string newText, uint newDeadline);

function createTodo(string memory _text, uint _deadline) external returns(uint){
    require(bytes(_text).length > 0, "Empty text");
    require(_deadline > (block.timestamp + 600), "Invalid deadline");
    require(msg.sender != address(0), "Zero address");

    todoCounter++;

    todos[todoCounter] = TodoList(todoCounter, msg.sender, _text, Status.Pending, _deadline);
    userTodoIds[msg.sender].push(todoCounter);

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

    emit TodoMarkedDone(_id);
}

function cancelTodo(uint _id) external {
    require((_id > 0) && (_id <= todoCounter), "Invalid id");
    TodoList storage todo = todos[_id];
    require(todo.status == Status.Pending, "Not pending");
    require(msg.sender == todo.owner, "Unauthorized caller");

    todo.status = Status.Cancelled;

    emit TodoCancelled(_id);
}

function updateTodo(uint _id, string memory _newText, uint _newDeadline) external {
    require((_id > 0) && (_id <= todoCounter), "Invalid id");
    TodoList storage todo = todos[_id];
    require(todo.status == Status.Pending, "Not pending");
    require(msg.sender == todo.owner, "Unauthorized caller");
    require(bytes(_newText).length > 0, "Empty text");
    require(_newDeadline > block.timestamp, "Invalid deadline");

    todo.text = _newText;
    todo.deadline = _newDeadline;

    emit TodoUpdated(_id, _newText, _newDeadline);
}

function getTodo(uint _id) external view returns(TodoList memory) {
    require((_id > 0) && (_id <= todoCounter), "Invalid id");
    return todos[_id];
}

function getMyTodos() external view returns(TodoList[] memory) {
    uint[] storage ids = userTodoIds[msg.sender];
    TodoList[] memory result = new TodoList[](ids.length);
    
    for (uint i = 0; i < ids.length; i++) {
        result[i] = todos[ids[i]];
    }
    
    return result;
}

function getTodoCount() external view returns(uint) {
    return todoCounter;
}

function getUserTodoCount(address _user) external view returns(uint) {
    return userTodoIds[_user].length;
}

function checkDefaultedTodos(uint[] calldata _ids) external {
    for (uint i = 0; i < _ids.length; i++) {
        uint id = _ids[i];
        require((id > 0) && (id <= todoCounter), "Invalid id");
        TodoList storage todo = todos[id];
        
        if (todo.status == Status.Pending && block.timestamp > todo.deadline) {
            todo.status = Status.Defaulted;
        }
    }
}

}