# Todo Smart Contract

A Solidity smart contract for managing todo items on the Ethereum blockchain.

## Overview

The Todo contract allows users to create todo items with deadlines, track their status, and mark them as done. The contract automatically handles deadline enforcement - if a todo is marked as done after its deadline, it will be marked as "Cancelled" instead of "Done".

## Contract Details

- **Solidity Version**: ^0.8.28
- **License**: UNLICENSED

## Contract Structure

### Data Structures

#### TodoList Struct
```solidity
struct TodoList {
    uint256 id;      
    address owner;       
    string text;    
    Status status;
    uint256 deadline;    
}
```

#### Status Enum
```solidity
enum Status {
    Pending,
    Done,       
    Cancelled,   
    Defaulted  
}
```

### State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `todoCounter` | `uint256` | Auto-incrementing counter for todo IDs |
| `todos` | `mapping(uint => TodoList)` | Storage mapping for all todos |

### Events

- **`TodoCreated(string text, uint deadline)`** - Emitted when a new todo is created

## Functions

### createTodo

Creates a new todo item with a specified text and deadline.

```solidity
function createTodo(string memory _text, uint deadline) external returns(uint)
```

**Parameters:**
- `_text` - The todo description (cannot be empty)
- `deadline` - Unix timestamp (must be at least 10 minutes in the future)

**Returns:**
- `uint` - The ID of the newly created todo

**Requirements:**
- Text must not be empty
- Deadline must be at least 600 seconds (10 minutes) from current block timestamp

**Validation Error Messages:**
- `"Empty text"` - If text is empty
- `"Invalid deadline"` - If deadline is not at least 10 minutes in the future

---

### markAsDone

Marks a todo as done. Automatically checks if the deadline has passed.

```solidity
function markAsDone(uint _id) external
```

**Parameters:**
- `_id` - The ID of the todo to mark as done

**Requirements:**
- Todo ID must be valid (between 1 and todoCounter)
- Todo must be in "Pending" status

**Behavior:**
- If current timestamp > deadline: status becomes `Cancelled`
- If current timestamp <= deadline: status becomes `Done`

**Validation Error Messages:**
- `"Invalid id"` - If todo ID is out of bounds
- `"Not pending"` - If todo is not in Pending status

---

### todoCounter (Getter)

Returns the total number of todos created.

```solidity
function todoCounter() external view returns(uint256)
```

## Usage Example

### Creating a Todo

```javascript
// Create a todo with 1 hour deadline
const deadline = Math.floor(Date.now() / 1000) + 3600;
const tx = await todoContract.createTodo("Complete project report", deadline);
const receipt = await tx.wait();

// Get the todo ID from the event
const event = receipt.events.find(e => e.event === "TodoCreated");
const todoId = event.args[1]; // or use the return value from the function
```

### Marking a Todo as Done

```javascript
// Mark todo #1 as done
await todoContract.markAsDone(1);
```

### Reading Todo Data

```javascript
// Get the current todo counter
const count = await todoContract.todoCounter();

// Get a specific todo
const todo = await todoContract.todos(1);
console.log(todo.text);
console.log(todo.status); // 0=Pending, 1=Done, 2=Cancelled, 3=Defaulted
console.log(todo.deadline);
```

## Deployment

This project uses Hardhat for development and deployment. 

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Sepolia Testnet

```bash
npx hardhat ignition deploy ignition/modules/todo.ts --network sepolia
```

## Contract Address

After deployment, the contract address will be stored in:
```
ignition/deployments/chain-11155111/deployed_addresses.json
```

(Note: 11155111 is the chain ID for Sepolia testnet)

## Security Considerations

1. **Deadline Validation**: The contract requires a minimum 10-minute deadline to prevent front-running issues
2. **Access Control**: Only the todo owner can mark their todos as done (current implementation allows anyone to call markAsDone - consider adding owner validation for production use)
3. **Gas Efficiency**: The contract uses mappings for O(1) access to todo items

## License

UNLICENSED
