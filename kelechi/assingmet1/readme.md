# Todo Factory (Solidity)

Public factory pattern for todo lists:

- Anyone can create a personal `TodoList` from `TodoFactory`.
- Each `TodoList` is owned by its creator.
- Only the owner of a list can add, update, complete, or delete todos in that list.

## Project Structure

- `TodoFactory.sol`: contains both `TodoFactory` and `TodoList`
- `test/TodoFactory.test.ts`: TypeScript unit tests (Hardhat + Chai)
- `hardhat.config.ts`: Hardhat config
- `tsconfig.json`: TypeScript config
- `package.json`: scripts and dev dependencies

## Contract Design

### `TodoFactory`

Responsibilities:

- Deploys new `TodoList` contracts with `owner = msg.sender`
- Stores per-user list addresses
- Stores global list addresses

Main functions:

- `createTodoList() returns (address)`
- `getMyTodoLists() returns (address[])`
- `getTodoListsByUser(address user) returns (address[])`
- `getAllTodoLists() returns (address[])`
- `totalTodoLists() returns (uint256)`

Event:

- `TodoListCreated(address creator, address todoList, uint256 userListCount)`

### `TodoList`

Todo item fields:

- `text`
- `completed`
- `deleted` (soft delete)
- `createdAt`
- `updatedAt`

Main functions:

- `addTodo(string text) returns (uint256 todoId)`
- `updateTodoText(uint256 todoId, string newText)`
- `setTodoCompleted(uint256 todoId, bool completed)`
- `deleteTodo(uint256 todoId)`
- `getTodo(uint256 todoId) returns (Todo)`
- `totalTodos() returns (uint256)`

Access control:

- write operations are protected by `onlyOwner`

Events:

- `TodoAdded`
- `TodoUpdated`
- `TodoCompleted`
- `TodoDeleted`

## Local Development (Hardhat + TypeScript)

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
cd kelechi/assingmet
npm install
```

### Compile

```bash
npm run compile
```

### Run Unit Tests

```bash
npm test
```

Current test coverage includes:

- factory deployment and address tracking
- ownership assignment
- todo CRUD lifecycle
- non-owner revert checks
- invalid input/state revert checks

## Remix Quick Test

1. Open Remix and create `TodoFactory.sol`
2. Paste the contract code
3. Compile using Solidity `0.8.24`
4. Deploy `TodoFactory`
5. Call `createTodoList()`
6. Call `getMyTodoLists()` and copy the list address
7. Load `TodoList` at that address using `At Address`
8. Call:
   - `addTodo("Learn Solidity")`
   - `updateTodoText(0, "Learn Solidity deeply")`
   - `setTodoCompleted(0, true)`
   - `deleteTodo(0)`
   - `getTodo(0)`

## Security Notes

- Factory is intentionally public.
- Each list is isolated by owner account.
- Deleted todos are soft-deleted (`deleted = true`) and remain queryable.
