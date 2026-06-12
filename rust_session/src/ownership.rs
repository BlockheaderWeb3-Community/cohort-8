pub fn test_ownership() {
    let name = String::from("Alice"); // `name` is the owner of this String
    // name.push('r');
    println!("name is: {}", name);
}

pub fn call_name() {
    let name: &str = "Yusrah";
    // name.
    
    println!("name is: {}", name);
}


pub fn test_move() {
    let a = String::from("Anagkazo");
    println!("{}", a.clone()); // ✅ compiles: another address has been created in memory
    let b = a;          // ownership moves from `a` to `b`

    // println!("{}", a); // ❌ compile error: `a` was moved
    println!("{}", b);    // ✅ `b` is the owner now
}

pub fn greet(s: String) {          // `s` takes ownership
    println!("Hello, {}!", s);
}                               // `s` is dropped here

pub fn call_greet() {
    let name = String::from("Bob");
    greet(name);               // ownership moves into `greet`

    // println!("{}", name);   // ❌ compile error: `name` was moved
}