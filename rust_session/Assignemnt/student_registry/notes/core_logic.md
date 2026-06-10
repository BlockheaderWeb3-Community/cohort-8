# Ownership, Borrowing & Referencing in the Student Registry

This document walks through every place ownership, borrowing, and referencing
appear in the four files of the student registry project —
`grade.rs`, `student_struct.rs`, `registry.rs`, and `main.rs` —
and explains _why_ each one is used.

---

## Quick reminder: the three concepts

| Concept                          | Syntax          | Meaning                                                                                     |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------- |
| **Ownership**                    | `let x = value` | One variable is responsible for the value. When it goes out of scope, the value is dropped. |
| **Mutable borrow**               | `&mut T`        | Temporarily lend the value for reading AND writing. No ownership transfer.                  |
| **Immutable borrow / reference** | `&T`            | Temporarily lend the value for reading only. No ownership transfer.                         |

---

## 1. `grade.rs`

```rust
pub fn as_str(&self) -> &str {
    match self {
        Grade::First  => "1st Year",
        Grade::Second => "2nd Year",
        Grade::Third  => "3rd Year",
    }
}
```

### `&self` — immutable borrow of Grade

`as_str` only needs to _read_ the variant — it never changes it.
`&self` is an immutable reference to the `Grade` value.

- The caller keeps ownership of the `Grade`.
- `as_str` borrows it just long enough to run the `match` and return a string.
- When `as_str` returns, the borrow ends. The caller still owns the `Grade`.

### `-> &str` — returning a reference to static memory

The returned `&str` points to string literals like `"1st Year"` which live in
the program's static memory (baked into the binary). No heap allocation occurs.
The reference is valid for the entire lifetime of the program.

---

## 2. `student_struct.rs`

```rust
use crate::grade::Grade;

pub struct Student {
    pub id:    u32,
    pub name:  String,
    pub age:   u8,
    pub grade: Grade,
    pub score: f32,
}

impl Student {
    pub fn new(id: u32, name: String, age: u8, grade: Grade, score: f32) -> Student {
        Student { id, name, age, grade, score }
    }
}
```

### `fn new(…) -> Student` — ownership transfer via return value

`new` takes all five arguments **by value** — it takes ownership of each one:

| Parameter | Type     | What happens                                           |
| --------- | -------- | ------------------------------------------------------ |
| `id`      | `u32`    | Copied (primitive, `Copy` trait)                       |
| `name`    | `String` | **Moved** into the struct — heap memory is transferred |
| `age`     | `u8`     | Copied (primitive)                                     |
| `grade`   | `Grade`  | **Moved** into the struct — enum value transferred     |
| `score`   | `f32`    | Copied (primitive)                                     |

When `new` returns the `Student`, ownership of the entire struct — including
the `String` on the heap — moves to whoever called `new`.

### Why `String` and not `&str`?

`String` is an _owned_, heap-allocated string. The struct needs to _own_ its
`name` field so the name lives as long as the `Student` does. If we used `&str`
(a borrowed reference), we would have to track where the original string lives
and guarantee it outlives the struct — that is lifetime annotation territory,
which is more advanced.

---

## 3. `registry.rs`

```rust
pub struct Registry {
    pub students: Vec<Student>,
    next_id: u32,
}
```

### `Vec<Student>` — Registry owns all students

`Registry` owns the `Vec`, and the `Vec` owns every `Student` inside it.
This is a chain of ownership:

```
Registry
  └── Vec<Student>  (heap)
        ├── Student { id, name, age, grade, score }
        ├── Student { … }
        └── Student { … }
```

When `Registry` is dropped, the `Vec` is dropped, which drops every `Student`,
which drops every `String` inside each student. One owner, one cleanup — no
manual `free()` needed.

---

### `pub fn new() -> Registry`

```rust
pub fn new() -> Registry {
    Registry {
        students: Vec::new(),
        next_id: 1,
    }
}
```

Returns an owned `Registry` by value. The caller takes ownership.
`Vec::new()` creates an empty `Vec` — no heap allocation yet.
The heap only gets used when the first `push()` happens.

---

### `pub fn add(&mut self, name: &str, age: u8, grade: Grade, score: f32)`

```rust
pub fn add(&mut self, name: &str, age: u8, grade: Grade, score: f32) {
    let id = self.next_id;
    let student = Student::new(id, name.to_string(), age, grade, score);
    println!("  ✅  Added: {} (ID {})", student.name, student.id);
    self.students.push(student);
    self.next_id += 1;
}
```

There are three distinct ownership/borrowing events here:

#### `&mut self` — mutable borrow of Registry

`add` needs to _change_ the registry — it pushes a new student and increments
`next_id`. So it takes a **mutable borrow** of the whole `Registry`.

- The caller keeps ownership of the `Registry`.
- `add` can read and write any field on it.
- Only one `&mut` borrow can exist at a time — Rust enforces this.

#### `name: &str` — immutable reference to a string

`name` comes in as `&str` — a **borrowed reference** to a string slice.
`add` does not take ownership of the string. It only needs to read the
characters long enough to call `name.to_string()`.

`name.to_string()` creates a brand-new owned `String` on the heap — that
owned copy is what gets moved into `Student::new`. The original string the
caller passed in is untouched and still owned by the caller.

#### `grade: Grade` — ownership moves in

`grade` is passed **by value** — ownership moves from the caller into `add`,
then immediately into `Student::new`, then into the `Student` struct.
After `reg.add(…, Grade::First, …)` in `main.rs`, the `Grade::First` value
lives inside the `Student` inside the `Vec`. The caller no longer holds it.

#### `self.students.push(student)` — Vec takes ownership of Student

After `println!`, `student` is moved into the `Vec` via `push`. From this
point:

- `student` is no longer accessible as a local variable.
- The `Vec` is the owner.
- The memory for the student (including its `String name` on the heap) will be
  freed only when the `Vec` itself is dropped.

---

### `pub fn list_all(&self)`

```rust
pub fn list_all(&self) {
    for student in &self.students {
        println!(
            "  {:>5}  {:<20}  {:>6}  {:<10}  {:.1}",
            student.id,
            student.name,
            student.age,
            student.grade.as_str(),
            student.score,
        );
    }
}
```

#### `&self` — immutable borrow of Registry

`list_all` only reads — it never changes anything. `&self` is the correct
choice. The caller keeps ownership of the `Registry` and can use it again
after `list_all` returns.

#### `for student in &self.students` — borrowing each element

The `&` before `self.students` means we are iterating over **references** to
each `Student` — not moving them out of the `Vec`.

- `student` inside the loop is `&Student` — a borrowed reference.
- The `Vec` still owns every student.
- Reading `student.id`, `student.name`, `student.age`, `student.score` is
  fine because we are borrowing those fields through the reference.

#### `student.grade.as_str()` — chained borrow

`student` is `&Student`, so `student.grade` is accessing the `Grade` field
through a reference. Rust auto-derefs this for us.
`as_str` then takes `&self` on the `Grade` — another immutable borrow layered
on top. Both borrows exist only for the duration of the `println!` line, then
they end.

---

## 4. `main.rs`

```rust
fn main() {
    let mut reg = Registry::new();

    reg.add("Henry Osei",  20, Grade::First,  78.5);
    reg.add("Kofi Mensah", 22, Grade::Second, 64.0);
    reg.add("Esi Boateng", 21, Grade::First,  91.0);

    reg.list_all();
}
```

### `let mut reg` — main owns Registry

`main` owns `reg`. It must be `mut` because `add` takes `&mut self` — you
cannot mutably borrow something that was not declared mutable.

### `reg.add(…)` — temporary mutable borrow

Each call to `reg.add(…)` mutably borrows `reg` for the duration of that call.
When `add` returns, the mutable borrow ends and `reg` is available again for
the next call.

### String literals as `&str`

`"Henry Osei"` is a string literal — its type is `&str`. It is a reference
pointing into static memory. `add` accepts `name: &str`, so this matches
directly. No allocation happens. Inside `add`, `name.to_string()` is where
the heap allocation occurs.

### `reg.list_all()` — temporary immutable borrow

`list_all` takes `&self` — an immutable borrow of `reg`. After it returns,
`reg` is still owned by `main`. At the closing `}` of `main`, `reg` goes out
of scope and is dropped — which drops the `Vec`, which drops every `Student`,
which drops every `String name` on the heap.

---

## Summary map

```
main.rs
│
│  let mut reg = Registry::new();
│      └── main owns reg (and its Vec<Student>)
│
│  reg.add("Henry", 20, Grade::First, 78.5)
│      ├── &mut self        — mutable borrow of reg (temporary)
│      ├── name: &str       — immutable borrow of "Henry" (caller keeps it)
│      ├── grade: Grade     — ownership of Grade::First moves into Student
│      └── push(student)    — Vec takes ownership of Student
│
│  reg.list_all()
│      ├── &self            — immutable borrow of reg (temporary)
│      ├── &self.students   — immutable borrow of Vec
│      └── &student         — immutable borrow of each Student in the loop
│              └── student.grade.as_str()
│                      └── &self on Grade — chained immutable borrow
│
└── } ← reg dropped → Vec dropped → all Students dropped → all Strings freed
```

---

## The one pattern to remember

```
Does the function need to change the value?
  YES → &mut self  (mutable borrow)
  NO  → &self      (immutable borrow)

Does ownership need to leave the caller permanently?
  YES → pass by value  (e.g. grade: Grade into add())
  NO  → pass by reference  (e.g. name: &str into add())
```

Rust enforces these choices at compile time. If you get them wrong, the
compiler tells you exactly which rule was broken and on which line — that is
the compiler errors you saw in the previous session.
