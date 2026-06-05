pub fn mul(x:u8, y:u8)-> u8 {
    if x == 0 || y == 0
    {
        return 0;
    }

    x.checked_mul(y).expect("overflow")

}