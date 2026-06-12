# Referencing in Rust — ELI5

A reference is just an address — it tells Rust _where_ a value lives in memory,
without taking the value away from its owner.

If ownership is _having_ something, a reference is _knowing where it is_.

---

## The core idea

```rust
fn main() {
    let score: i32 = 95;

    let r = &score;   // r is a reference — it holds the address of `score`

    println!("score  = {}", score);   // use the original
    println!("via r  = {}", r);       // use the reference — same value
    println!("addr   = {:p}", r);     // {:p} prints the memory address e.g. 0x7ffee3b2c490
}
```

`score` is the value sitting in memory.
`r` is a small variable that holds the _address_ of `score` — nothing more.
Both `score` and `r` print `95` because `r` points straight at `score`.

---

## Dereferencing — following the address

The `*` operator means "go to the address this reference holds and give me
what is there".

```rust
fn main() {
    let x = 10;
    let r = &x;   // r holds the address of x

    println!("{}", r);    // Rust auto-derefs for println — prints 10
    println!("{}", *r);   // explicit deref — also prints 10

    // Think of it like:
    // r  = the street address of a house
    // *r = walking to that address and looking inside the house
}
```

---

## Changing a value through a mutable reference

```rust
fn main() {
    let mut points = 50;
    let r = &mut points;   // mutable reference — can read AND write

    *r = 100;   // go to the address and write 100 there

    println!("{}", points);   // 100 — the original changed
}
```

`r` is not a copy of `points`. It is a direct window into the same memory slot.
Writing through `*r` changes `points` itself.

---

## Printing the address with `{:p}`

```rust
fn main() {
    let name = String::from("Kofi");
    let r = &name;

    println!("value   : {}", r);     // Kofi
    println!("address : {:p}", r);   // e.g. 0x7ffee3b2c490

    // The address will be different every time you run the program.
    // The OS places things at different spots in RAM on each run.
}
```

`{:p}` is the "pointer" format specifier — it shows the raw memory address
the reference holds.

---

## Multiple references to the same value

```rust
fn main() {
    let city = String::from("Accra");

    let r1 = &city;
    let r2 = &city;
    let r3 = &city;

    // All three references point to the SAME memory — no copies made
    println!("{:p}", r1);   // same address
    println!("{:p}", r2);   // same address
    println!("{:p}", r3);   // same address

    println!("{} {} {}", r1, r2, r3);   // Accra Accra Accra
}
```

References are cheap — they are just addresses (8 bytes on a 64-bit system).
No matter how large the original value is, the reference is always the same tiny size.

---

## References vs owned values — size comparison

```rust
use std::mem::size_of;
use std::mem::size_of_val;

fn main() {
    let name = String::from("Henry Osei");   // String on heap
    let r = &name;

    // String = 3 words on the stack (ptr + len + cap)
    println!("size of String  : {} bytes", size_of_val(&name));   // 24 bytes
    // Reference = 1 pointer
    println!("size of &String : {} bytes", size_of::<&String>()); // 8 bytes

    // The reference is always 8 bytes regardless of how long the name is.
}
```

---

## References into a Vec — what the for loop actually does

```rust
fn main() {
    let students = vec![
        String::from("Henry"),
        String::from("Kofi"),
        String::from("Esi"),
    ];

    // &students.students borrows the Vec — gives references to each element
    for name in &students {
        //  name is &String — a reference, not an owned String
        println!("{:p}  →  {}", name, name);   // address → value
    }

    // students is still owned here — the loop only borrowed
    println!("total: {}", students.len());
}
```

Without the `&`, the loop would _move_ each `String` out of the `Vec` and the
`Vec` would be unusable afterwards.

---

## In the student registry

```rust
// list_all iterates with &self.students
// — each `student` is a &Student reference, not an owned Student

pub fn list_all(&self) {
    for student in &self.students {
        //  student : &Student
        //  student.name  : &String  (accessed through the reference)
        //  student.grade : &Grade   (accessed through the reference)

        println!(
            "{} {} {}",
            student.name,          // Rust auto-derefs &Student to reach .name
            student.grade.as_str(), // chained reference: &Student → &Grade → &str
            student.score,
        );
    }
    // Nothing was moved. Every Student is still inside the Vec.
}
```

---

## The difference between `&` and `&mut` in one picture

```
Memory slot:  [ 95 ]   ← the value lives here at address 0xABC

&score        →  read-only window into 0xABC
                 many allowed at the same time

&mut score    →  read-write window into 0xABC
                 only ONE allowed, and no &score at the same time
```

---

## One-line mental model

```
&T        →  "I know where it lives — I can look"
&mut T    →  "I know where it lives — I can look and change"
*r        →  "go to the address r holds and get what's there"
{:p}      →  "show me the raw address as a number"
```

Rust guarantees at compile time that every reference always points to valid
memory — no dangling pointers, no null, no use-after-free. Ever.
