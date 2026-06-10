# Rust Student Registry
### A beginner project covering: `struct` · `Vec<T>` · `enum` · `Option<T>` · `impl`

```bash
// ============================================================
//  STUDENT REGISTRY — Beginner Rust Project
//  Concepts covered:
//    • struct          — grouping related data
//    • enum            — a value that can be one of several variants
//    • Vec<T>          — a growable list
//    • Option<T>       — a value that may or may not exist
//    • impl block      — adding methods to a struct
//    • pattern matching (match, if let)
//    • ownership & borrowing in practice
// ============================================================
```

---

## How to run

### Step 1 — Install Rust (if you haven't yet)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Then restart your terminal, or run:
```bash
source "$HOME/.cargo/env"
```

### Step 2 — Verify the install
```bash
rustc --version   # e.g. rustc 1.78.0
cargo --version   # e.g. cargo 1.78.0
```

### Step 3 — Run the project
```bash
# Clone / copy this folder, then:
cd student_registry

cargo run          # compiles + runs in one command
```

### Other useful commands
```bash
cargo build        # compile only (output goes to ./target/debug/)
cargo check        # fast type-check without producing a binary (great while learning)
cargo run --release  # compile with full optimisations (faster binary)
```

---

## What the project teaches

| Concept | Where to look in main.rs |
|---|---|
| `struct` | `Student` and `Registry` definitions (~line 30, 90) |
| `enum` | `Grade` definition (~line 14) |
| `impl` block | `impl Grade`, `impl Student`, `impl Registry` |
| `Vec<T>` | `Registry.students` field; `push`, `retain`, `iter` |
| `Option<T>` | `find_by_name`, `find_by_id` return types; `demo_option()` |
| `match` | `Grade::as_str`, `letter_grade`, search demos |
| `if let` | `update_score`, `summary`, `demo_option` |
| Ownership / borrowing | `&self` vs `&mut self` on every method |
| Iterator methods | `summary()` — `.map()`, `.sum()`, `.max_by()` |

---

## Expected output (abridged)

```
  ╔══════════════════════════════════════╗
  ║      RUST STUDENT REGISTRY v1.0      ║
  ║  struct · Vec · enum · Option · impl ║
  ╚══════════════════════════════════════╝

  ┌─ 1. Adding students (struct + Vec::push) 
  ✅  Added: Kay (ID 1)
  ✅  Added: Yusrah (ID 2)
  ...

  ┌─ 3. Search by name (Option<&Student>)
  Found → ID: 2  Grade: 2nd Year  Score: 64
  'Yaw Owusu' not found in registry.

  ┌─ 8. Summary (iterators: map, sum, max_by)
  Total students : 4
  Average score  : 71.5
  Top student    : Esi Boateng (91.0)
```

---

## Project structure

```
student_registry/
├── Cargo.toml        ← project metadata & dependencies
└── src/
    └── main.rs       ← all code lives here (heavily annotated)
```

Everything is in one file intentionally — beginners don't need to navigate modules yet.
