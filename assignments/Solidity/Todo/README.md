# Todo Smart Contract

A Solidity smart contract for managing personal TODO tasks with deadlines and status tracking.

---

## Overview

This contract allows users to:

* Create TODO tasks with a text description and deadline
* Track the status of tasks: Pending, Done, Cancelled, or Defaulted
* Mark tasks as completed, automatically setting them to Done or Defaulted based on deadline

---

## Contract Details

* **License**: MIT
* **Solidity Version**: ^0.8.28

---

## State Variables

| Variable      | Type                      | Description                       |
| ------------- | ------------------------- | --------------------------------- |
| `todoCounter` | uint256                   | Tracks the total number of TODOs  |
| `todos`       | mapping(uint => TodoList) | Stores all TODO items by their ID |

### TodoList Struct

| Variable   | Type    | Description                                      |
| ---------- | ------- | ------------------------------------------------ |
| `id`       | uint    | Unique ID of the task                            |
| `owner`    | address | Task creator                                     |
| `text`     | string  | Task description                                 |
| `status`   | enum    | Task status: Pending, Done, Cancelled, Defaulted |
| `deadline` | uint256 | Timestamp when the task is due                   |

---

## Functions

### createTodo(string _text, uint _deadline)

Creates a new TODO task.

**Access:** Public

**Requirements:**

* `_text` cannot be empty
* `_deadline` must be at least 10 minutes in the future
* Caller cannot be zero address

**Notes:**

* Increments `todoCounter`
* Saves the new TODO in `todos` mapping
* Emits `TodoCreated` event

---

### completedTodo(uint _id)

Marks a TODO as completed.

**Access:** Task owner only

**Requirements:**

* `_id` must exist
* TODO must be `Pending`
* Caller must be the task owner

**Notes:**

* If the deadline has passed, sets status to `Defaulted`
* Otherwise, sets status to `Done`

---

## Events

| Event                                     | Description                        |
| ----------------------------------------- | ---------------------------------- |
| `TodoCreated(string text, uint deadline)` | Emitted when a new TODO is created |

---

## Important Notes

1. **Task Ownership**: Only the task creator can mark a TODO as completed.
2. **Deadline Handling**: If a task is completed after its deadline, its status is automatically set to `Defaulted`.
3. **Pending Tasks**: Only tasks with `Pending` status can be completed.

---

## Error Messages

| Message               | Meaning                                   |
| --------------------- | ----------------------------------------- |
| "Empty text"          | TODO text is empty                        |
| "Invalid Deadline"    | Deadline is less than 10 minutes from now |
| "Zero address"        | Caller is the zero address                |
| "Invalid id"          | TODO ID does not exist                    |
| "Not pending"         | TODO is not in Pending status             |
| "Unauthorized Caller" | Caller is not the task owner              |

---

## License

MIT

---
