## 2. Borrowing

Constantly moving ownership in and out of functions is awkward. **Borrowing** lets you give a function access to a value *without* transferring ownership.

You borrow a value by passing a **reference** to it.

```rust
fn greet(s: &String) {         // `s` is a reference to a String
    println!("Hello, {}!", s);
}                               // reference ends here; nothing is dropped

fn main() {
    let name = String::from("Carol");
    greet(&name);              // pass a reference — `name` keeps ownership

    println!("Still have: {}", name); // ✅ name is still valid
}
```

The `&` means "borrow this, don't take it". The function can use the value but cannot drop it.

### The two kinds of borrow

| Kind | Syntax | Can read? | Can modify? | How many at once? |
|---|---|---|---|---|
| Shared (immutable) | `&T` | ✅ | ❌ | Unlimited |
| Exclusive (mutable) | `&mut T` | ✅ | ✅ | Exactly one |

These rules together mean: **you can never have a mutable and an immutable reference to the same value at the same time.**

---
