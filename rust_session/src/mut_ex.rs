pub fn test_mut() {
    let mut name: String = String::from("Isaa");
    name.push('c');
    println!("name here: {name}");

    name.push_str("O");
    println!("name here: {name}");

}