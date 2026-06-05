pub fn divide(x: u8, y: u8) -> u8 {
    if y == 0 {
        panic!("division by zero");
    }
    x.checked_div(y).expect("division overflow")
}