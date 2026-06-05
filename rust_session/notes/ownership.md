# Rust Ownership, Borrowing & References
### A beginner's guide with annotated code

---

## Why these concepts exist

Most languages either make *you* manage memory (C, C++) or use a garbage collector to do it (Python, Java, Go). Rust takes a third path: the **compiler** enforces memory safety at compile time through three rules. No runtime cost, no GC pauses, no dangling pointers.

The three concepts build on each other:

```
Ownership → who is responsible for a value
Borrowing  → letting someone else use it temporarily
References → the actual mechanism for borrowing
```

---

## 1. Ownership

Every value in Rust has exactly **one owner**. When the owner goes out of scope, the value is dropped (freed).

```rust
fn main() {
    let name = String::from("Alice"); // `name` is the owner of this String
    println!("{}", name);
} // `name` goes out of scope here → String is dropped automatically
```

### Ownership moves on assignment

When you assign a heap value to another variable, ownership **moves** — the original variable becomes invalid.

```rust
fn main() {
    let a = String::from("hello");
    let b = a;          // ownership moves from `a` to `b`

    // println!("{}", a); // ❌ compile error: `a` was moved
    println!("{}", b);    // ✅ `b` is the owner now
}
```

> **Why?** If both `a` and `b` owned the same heap memory, Rust would try to free it twice — a classic bug. Moving prevents this.

### Ownership moves into functions too

```rust
fn greet(s: String) {          // `s` takes ownership
    println!("Hello, {}!", s);
}                               // `s` is dropped here

fn main() {
    let name = String::from("Bob");
    greet(name);               // ownership moves into `greet`

    // println!("{}", name);   // ❌ compile error: `name` was moved
}
```

### Copy types are different

Primitive types like `i32`, `bool`, `f64`, and `char` implement the `Copy` trait — they are copied, not moved, because they live entirely on the stack.

```rust
fn main() {
    let x = 5;
    let y = x;          // `x` is copied, not moved

    println!("{} {}", x, y); // ✅ both are valid — x is still usable
}
```

---