fn main(){
    let res = sub_num(10, 5);
}

fn sub_num(x: u128, y: u128) -> u128 {
     if y == 0
    {
        return x;
    }
    x.checked_sub(y).expect('underflow')
}
