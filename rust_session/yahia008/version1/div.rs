 #[derive(Debug)]
enum MathError {
    DivisionByZero,
    Overflow,  
}

fn main()
{

     match divide(100, 10) {
        Ok(result) => println!("100 / 10 = {}", result),
        Err(MathError::DivisionByZero) => println!("Error: Division by zero!"),
        Err(MathError::Overflow) => println!("Error: Overflow!"),
    }
    
    match divide(100, 0) {
        Ok(result) => println!("100 / 0 = {}", result),
        Err(MathError::DivisionByZero) => println!("Error: Division by zero!"),
        Err(MathError::Overflow) => println!("Error: Overflow!"),
    }

}

pub fn divide(x: u128, y: u128) -> Result<u128, MathError>{
    if y == 0 {
        return Result::Err(MathError::DivisionByZero);
    }

    Result::Ok(x / y)
}