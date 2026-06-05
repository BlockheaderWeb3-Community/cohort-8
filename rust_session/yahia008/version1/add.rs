
fn main(){
    let result = add(100, 50);
    println!("Result: {}", result);

   //this will panic
    let overflow = add(200, 100);
}

fn add(x:u8, y:u8) -> u8 {

        if y == 0 {
         return x;
        }
        x.checked_add(y).expect("overflow")
}