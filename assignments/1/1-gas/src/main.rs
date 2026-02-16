fn main() {
    let work = 1690;
    let price_per_work = 20;

    let gas_fee = get_gas_fee(work, price_per_work);

    println!("");
    println!("Your gas fee is: {}", gas_fee);
    println!("")
}

fn get_gas_fee(computation: u32, price_per_compute: u32) -> u32 {
    computation * price_per_compute
}