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

## 3. References

A reference is a pointer that is *guaranteed by the compiler* to be valid. No null pointers, no dangling pointers — ever.

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

> **The rule in plain English:** You can have as many readers as you like *or* exactly one writer — never both at the same time.

---

## 4. The slice — a special reference

A **slice** is a reference to a _part_ of a collection. It borrows a window into the data without copying it.

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[0..i]; // return a slice up to the first space
        }
    }
    &s[..] // whole string is one word
}

fn main() {
    let sentence = String::from("hello world");
    let word = first_word(&sentence);
    println!("First word: {}", word); // "hello"
}
```

---

## 5. Putting it all together

```rust
struct Player {
    name: String,
    score: u32,
}

// Takes ownership of `player` — caller loses it
fn destroy(player: Player) {
    println!("{} removed.", player.name);
}

// Borrows immutably — caller keeps ownership, can't modify
fn describe(player: &Player) {
    println!("{} has {} points.", player.name, player.score);
}

// Borrows mutably — caller keeps ownership, function can modify
fn award_points(player: &mut Player, points: u32) {
    player.score += points;
}

fn main() {
    let mut p = Player {
        name: String::from("Dave"),
        score: 0,
    };

    award_points(&mut p, 10); // mutably borrow
    describe(&p);             // immutably borrow — "Dave has 10 points."
    award_points(&mut p, 5);  // mutably borrow again
    describe(&p);             // "Dave has 15 points."

    destroy(p);               // move ownership in — `p` is invalid after this
    // describe(&p);           // ❌ compile error: `p` was moved
}
```

---

## 6. Stack frames

Think of the stack like a stack of trays in a cafeteria. Every time you call a function, a new tray is placed on top. Every local variable in that function lives on that tray. When the function returns, the tray is removed and everything on it disappears instantly.

```rust
fn add(a: i32, b: i32) -> i32 {
    // When `add` is called, a NEW frame is pushed onto the stack.
    // `a`, `b`, and `result` all live inside this frame.
    let result = a + b;
    result
    // Frame is popped here — `a`, `b`, `result` are gone.
}

fn main() {
    // main() has its own frame on the stack.
    let x = 10;   // lives in main's frame
    let y = 20;   // lives in main's frame

    let z = add(x, y); // a new frame for `add` is pushed on top of main's frame
                       // when add() returns, its frame is popped
                       // main's frame (x, y, z) is still there

    println!("{} + {} = {}", x, y, z); // 10 + 20 = 30
} // main's frame is popped — program ends
```

### Each function call gets its own frame — even recursive ones

```rust
fn countdown(n: i32) {
    // Each call to `countdown` gets its OWN frame with its OWN copy of `n`.
    // They do not share `n` — each frame is independent.
    if n == 0 {
        println!("Go!");
        return; // this frame is popped
    }
    println!("{}...", n);
    countdown(n - 1); // a new frame is pushed on top, with n-1
                      // when it returns, we come back to THIS frame
} // this frame is popped

fn main() {
    countdown(3);
    // Stack during execution (top = most recent):
    //   countdown(0)   ← top
    //   countdown(1)
    //   countdown(2)
    //   countdown(3)
    //   main           ← bottom
}
```

> **Key rule:** the stack frame only exists while the function is running. You cannot return a reference to a local variable — the frame (and the variable) will be gone.

```rust
// ❌ This does NOT compile — and that's a good thing.
fn make_number() -> &i32 {
    let n = 42;
    &n  // can't return a reference to `n` — `n` dies when this frame pops
}

// ✅ Return the value itself instead (copy it out of the frame).
fn make_number() -> i32 {
    let n = 42;
    n  // value is copied into the caller's frame
}
```

---

## 7. The memory allocator

When you need memory whose size isn't known until runtime — like a `String` the user types in, or a `Vec` that grows — the **allocator** steps in. It manages a large region of memory called the **heap** and hands out chunks on demand.

In Rust you rarely talk to the allocator directly. Types like `String`, `Vec<T>`, and `Box<T>` do it for you.

```rust
fn main() {
    // String::from calls the allocator: "give me enough heap space for 5 bytes"
    let s = String::from("hello");
    //  s on the stack looks like:  [ ptr | len=5 | cap=5 ]
    //                                  |
    //                                  └──► [ h | e | l | l | o ]  ← heap
    println!("{}", s);
} // s goes out of scope → Rust calls the allocator: "take this memory back"
  // No manual free(), no garbage collector needed.
```

### The allocator grows memory when needed

```rust
fn main() {
    let mut v: Vec<i32> = Vec::new(); // allocator gives a small block on the heap
    println!("len={}, cap={}", v.len(), v.capacity()); // len=0, cap=0

    v.push(1); // not enough space → allocator gives a bigger block, data is moved
    v.push(2);
    v.push(3);
    println!("len={}, cap={}", v.len(), v.capacity()); // len=3, cap=4 (typical)

    v.push(4);
    v.push(5); // exceeded cap=4 → allocator gives an even bigger block again
    println!("len={}, cap={}", v.len(), v.capacity()); // len=5, cap=8 (typical)
} // allocator reclaims all heap memory here
```

### `Box<T>` — putting a single value on the heap explicitly

```rust
fn main() {
    let x: i32 = 7;          // 7 lives on the stack
    let b: Box<i32> = Box::new(7); // 7 lives on the heap; `b` is a pointer on the stack

    println!("stack x = {}", x);
    println!("heap  b = {}", b); // Box auto-derefs, prints 7

    // When `b` goes out of scope, Box calls the allocator to free that heap slot.
    // You never need to call free() yourself.
}
```

> **One sentence summary:** the stack is fast but temporary; the heap is flexible but requires the allocator to track what's in use. Rust's ownership rules ensure the allocator is always called exactly once to free each allocation.

---

## 8. Pointers and addresses

Every byte in your computer's memory has a numbered address, like a house number on a street. A **pointer** is simply a variable that stores one of those addresses — it *points to* where some data lives.

In Rust, references (`&T`) *are* pointers under the hood. The compiler just adds safety rules on top.

```rust
fn main() {
    let x: i32 = 42;

    // `addr` is a raw pointer to x's address in memory.
    // We use `&raw const` to get it without creating a safe reference.
    let addr = &raw const x as usize; // cast address to a plain number

    println!("value of x  : {}", x);
    println!("address of x: 0x{:x}", addr); // e.g. 0x7ffee3b2c4bc (will vary each run)
}
```

The address printed will be different every time — the OS places your program at a different spot in memory on each run. What matters is the *concept*: `x` is data sitting at some address, and a pointer holds that address.

### A reference IS a pointer — with compiler guarantees

```rust
fn main() {
    let x: i32 = 100;
    let r: &i32 = &x; // `r` is a reference (a safe pointer) to `x`

    // Print the value `r` points to
    println!("value  : {}", *r); // dereference with `*` to get the value → 100

    // Print the address `r` holds
    println!("address: {:p}", r); // {:p} formats a reference as an address
                                  // e.g. 0x7ffee3b2c490
}
```

`{:p}` is the "pointer" format — it prints the memory address rather than the value.

### Following the pointer — dereferencing

Dereferencing (`*`) means "go to the address this pointer holds and give me what's there".

```rust
fn main() {
    let mut score: i32 = 50;
    let r: &mut i32 = &mut score; // mutable reference — a pointer that allows writing

    println!("before: {}", score);  // 50

    *r = 99; // dereference + assign: go to the address, write 99 there

    println!("after : {}", score);  // 99  ← `score` changed because `r` pointed at it
}
```

### Pointers to heap data — what `Box` looks like

```rust
fn main() {
    let b: Box<i32> = Box::new(7);
    //  b on the stack: [ 0x... ]  ← an address
    //                       |
    //                       └──► [ 7 ]  ← heap, at that address

    println!("b points to address : {:p}", b);   // address on the heap
    println!("value at that address: {}", *b);   // 7

    // Box<i32> is 8 bytes on a 64-bit system (just the address).
    // The i32 itself is 4 bytes, living on the heap at that address.
    println!("size of Box<i32> on stack: {} bytes", std::mem::size_of::<Box<i32>>()); // 8
    println!("size of i32 on heap     : {} bytes", std::mem::size_of::<i32>());       // 4
}
```

### Visualising the relationship

```
Stack                         Heap
─────────────────────         ──────────────────
b  │ 0x55a3f1c0  │──────────► │  7  │  (4 bytes at 0x55a3f1c0)
   └────────────┘             └─────┘
   (8 bytes — just an address)
```

> **One sentence summary:** a pointer is just a number — a memory address. A Rust reference is a pointer that the compiler has verified is always valid, always properly aligned, and never aliased unsafely.

---

## Quick-reference summary

```
OWNERSHIP
  let x = value;         x owns value
  let y = x;             ownership moves to y (x invalid for heap types)
  let y = x.clone();     deep copy — both valid

BORROWING
  fn f(x: &T)            immutable borrow — read only
  fn f(x: &mut T)        mutable borrow — read + write

REFERENCES
  &value                 create an immutable reference
  &mut value             create a mutable reference
  Rules enforced at compile time:
    - unlimited & at the same time
    - only one &mut, and never alongside &

SLICES
  &s[0..n]               reference to part of a string or vec
```

---

## Common beginner errors and fixes

| Error message                                                 | What happened                              | Fix                                                               |
| ------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `value used after move`                                       | You moved a value then tried to use it     | Use `&` to borrow, or `.clone()` to copy                          |
| `cannot borrow as mutable`                                    | You forgot `mut` on the variable           | Change `let x` to `let mut x`                                     |
| `cannot borrow as mutable because also borrowed as immutable` | You have `&` and `&mut` at the same time   | End the immutable borrow before creating the mutable one          |
| `does not live long enough`                                   | A reference outlives the data it points to | Make sure the owned value lives at least as long as the reference |
