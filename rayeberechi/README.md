# Todo Contract

A Solidity smart contract for managing a decentralized to-do list. This contract allows users to create tasks with deadlines, track their status, and manage their completion or cancellation.

## Contract Details
- **Solidity Version**: ^0.8.28
- **Network**: Ethereum (EVM compatible)

## Data Structures

### Enum: Status
Tracks the lifecycle of a task:
- `Pending` (0): Task created and active.
- `Done` (1): Task completed successfully.
- `Cancelled` (2): Task cancelled by the owner.
- `Defaulted` (3): Task not completed by the deadline.

### Struct: TodoList
- `id`: Unique identifier for the task.
- `owner`: Address of the task creator.
- `text`: Description of the task.
- `status`: Current status (from Enum).
- `deadline`: Timestamp (Unix) by which the task must be completed.

## Core Functions

### `createTodo`
Creates a new task.
- **Params**: `_text` (string), `_deadline` (uint timestamp).
- **Logic**: Validates that text is not empty and deadline is in the future.
- **Events**: Emits `TodoCreated`.

### `markAsDone`
Updates a task status to `Done`.
- **Params**: `_id` (uint).
- **Requirements**: Caller must be owner; task must be `Pending`.
- **Logic**: Checks current timestamp against deadline. If deadline passed, marks as `Defaulted` instead of `Done`.
- **Events**: Emits `TodoStatusChanged`.

### `cancelTodo`
Cancels a pending task.
- **Params**: `_id` (uint).
- **Requirements**: Caller must be owner; task must be `Pending`.
- **Events**: Emits `TodoStatusChanged`.