mod add;
mod div;
mod sub;
mod mul;

fn main() {

    use add::add;
    use div::divide;
    use sub::sub_num;
    use mul::mul;

    let add_result = add(10, 5);
    assert!(add_result == 15, "add_result is not 15");
    let div_result = divide(10, 5);
    assert!(div_result == 2, "div_result is not 2");
    let sub_result = sub_num(10, 5);
    assert!(sub_result == 5, "sub_result is not 5");
    let mull_result = mul(10, 2);
    assert!(mull_result == 20, "mull_result is not 20");
    
}
