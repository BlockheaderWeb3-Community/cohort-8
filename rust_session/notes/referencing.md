## 3. References

A reference is a pointer that is _guaranteed by the compiler_ to be valid. No null pointers, no dangling pointers — ever.

### Immutable reference (`&T`)

```rust
fn print_length(s: &String) {
    println!("Length: {}", s.len()); // can read
    // s.push_str(" world");         // ❌ can't modify through &String
}

fn main() {
    let message = String::from("hello");

    let r1 = &message; // first shared borrow
    let r2 = &message; // second shared borrow — totally fine

    println!("{} and {}", r1, r2); // ✅ multiple readers are safe
}
```

### Mutable reference (`&mut T`)

```rust
fn append_world(s: &mut String) {
    s.push_str(", world"); // ✅ can modify through &mut
}

fn main() {
    let mut message = String::from("hello"); // must be `mut` to borrow mutably
    append_world(&mut message);
    println!("{}", message); // "hello, world"
}
```

### The exclusivity rule in action

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;      // immutable borrow
    let r2 = &s;      // another immutable borrow — fine
    // let r3 = &mut s; // ❌ can't have &mut while &s exists

    println!("{} {}", r1, r2);
    // r1 and r2 are no longer used after this point

    let r3 = &mut s;  // ✅ now fine — r1 and r2 are done
    r3.push_str("!");
    println!("{}", r3);
}
```

> **The rule in plain English:** You can have as many readers as you like _or_ exactly one writer — never both at the same time.

---
