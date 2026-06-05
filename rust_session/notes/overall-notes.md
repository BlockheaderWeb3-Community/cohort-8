
## 4. The slice — a special reference

A **slice** is a reference to a *part* of a collection. It borrows a window into the data without copying it.

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

| Error message | What happened | Fix |
|---|---|---|
| `value used after move` | You moved a value then tried to use it | Use `&` to borrow, or `.clone()` to copy |
| `cannot borrow as mutable` | You forgot `mut` on the variable | Change `let x` to `let mut x` |
| `cannot borrow as mutable because also borrowed as immutable` | You have `&` and `&mut` at the same time | End the immutable borrow before creating the mutable one |
| `does not live long enough` | A reference outlives the data it points to | Make sure the owned value lives at least as long as the reference |
