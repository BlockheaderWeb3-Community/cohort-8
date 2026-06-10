# Borrowing Deep Dive
Borrowing is like lending something to a friend.

---

## The core idea

```rust
fn main() {
    let book = String::from("Rust Programming");

    read(&book);   // lend the book to `read`

    // book is still yours after the function returns
    println!("I still have: {}", book);
}

fn read(b: &String) {   // b is a borrowed reference — not the owner
    println!("Reading: {}", b);
}   // borrow ends here — nothing is dropped
```

You still own `book`. `read` just borrowed it temporarily. When `read` finishes,
the book comes back to you automatically.

---

## Without borrowing — ownership moves away

```rust
fn main() {
    let book = String::from("Rust Programming");

    read(book);   // ownership MOVES into read — you no longer have it

    println!("{}", book);   // ❌ compile error: book was moved
}

fn read(b: String) {   // b owns the book now
    println!("Reading: {}", b);
}   // b is dropped here — book is gone forever
```

This is why borrowing exists. Without `&`, the value moves in and never comes back.

---

## Two kinds of borrow

### 1. Immutable borrow `&T` — look but don't touch

```rust
fn main() {
    let score = 95;

    print_score(&score);   // lend score for reading

    println!("score is still {}", score);   // ✅ still usable
}

fn print_score(s: &i32) {
    println!("Score: {}", s);
    // *s = 100;   // ❌ can't change it — it's an immutable borrow
}
```

### 2. Mutable borrow `&mut T` — borrow AND change it

```rust
fn main() {
    let mut score = 95;   // must be `mut` to lend mutably

    add_bonus(&mut score);   // lend score for writing

    println!("new score: {}", score);   // 100
}

fn add_bonus(s: &mut i32) {
    *s += 5;   // * means "go to what this points to and change it"
}
```

---

## The two rules Rust enforces

### Rule 1 — as many readers as you like

```rust
fn main() {
    let name = String::from("Henry");

    let r1 = &name;   // borrow 1 — fine
    let r2 = &name;   // borrow 2 — also fine
    let r3 = &name;   // borrow 3 — still fine

    println!("{} {} {}", r1, r2, r3);   // ✅ multiple readers are safe
}
```

Think of a book in a library — unlimited people can read the same book at the
same time because no one is changing it.

### Rule 2 — only ONE writer, and no readers at the same time

```rust
fn main() {
    let mut name = String::from("Henry");

    let r1 = &name;          // immutable borrow
    let r2 = &mut name;      // ❌ compile error — can't have &mut while &name exists

    println!("{} {}", r1, r2);
}
```

```rust
fn main() {
    let mut name = String::from("Henry");

    let r1 = &name;
    println!("{}", r1);   // r1 last used here — borrow ends

    let r2 = &mut name;   // ✅ fine now — r1 is done
    r2.push_str(" Osei");
    println!("{}", r2);   // "Henry Osei"
}
```

Think of a whiteboard — unlimited people can read it, but the moment someone
starts writing on it, everyone else has to step back.

---

## In the student registry

```rust
// &mut self — we need to CHANGE the registry (push a new student)
pub fn add(&mut self, name: &str, ...) {
    //             ^^^
    //             mutable borrow — we will modify self.students

    self.students.push(student);   // this is the change
}

// &self — we only READ the registry (print students)
pub fn list_all(&self) {
    //          ^^^^^
    //          immutable borrow — we never change anything

    for student in &self.students {   // borrow each student for printing
        println!("{}", student.name);
    }
}
```

---

## One-line mental model

```
&T      →  "I want to look at it"
&mut T  →  "I want to look at it AND change it"
T       →  "I want to own it and take it with me"
```

Rust checks these rules at compile time — zero runtime cost, zero crashes.
