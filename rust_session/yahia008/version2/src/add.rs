
pub fn add(x:u8, y:u8) -> u8 {
    if y == 0 
    {
        return x;
    }
    x.checked_add(y).expect("overflow")
}

