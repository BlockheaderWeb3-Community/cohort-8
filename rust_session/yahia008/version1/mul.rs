 #[derive(Debug)]
enum MathError {
    DivisionByZero,
    Overflow,  
}

fn main(){

    let result = multiply_number(10, 20);
    println!("{:?}", result); 
    

    let zero_result = multiply_number(0, 100);
    println!("{:?}", zero_result); 
    
    let overflow_result = multiply_number(u128::MAX, 2);
    println!("{:?}", overflow_result);  

      match multiply_number(u128::MAX, 2) {
        Ok(value) => println!("Multiplication result: {}", value),
        Err(MathError::Overflow) => println!("Error: Multiplication overflow!"),
    }
    
}

 fn multiply_number(x:u128, y:u128) -> Result<u128, MathError> {
    if x == 0 || y == 0 {
         return Ok(0);
    } 
    x.checked_mul(y).ok_or(MathError::Overflow)
}


