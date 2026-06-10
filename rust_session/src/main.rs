use crate::todo::Todo;

// mod sub;
// mod sum;
// mod ownership;
// mod array;
// mod mut_ex;
mod voters;
mod todo;



fn main() {
    // use sub::sub;
    // sub(10, 5);
    // ownership::test_ownership();
    // ownership::call_name();
    // array::test_array();
    // ownership::test_move();
    // ownership::call_greet();
    // mut_ex::test_mut();
    voters::check_voter_eligibility(20);

    let todo1 = Todo::create_todo(
        1,
        "Buy milk".to_string(),
        "Get 2 liters of whole milk".to_string(),
        todo::Status::Pending,
    );
    println!("{:?}", todo1);

    let todo2 = Todo::add_todo(
        1, // current highest ID
        "Walk the dog".to_string(),
        "Around the block twice".to_string(),
        todo::Status::Ongoing,
    );
    println!("{:?}", todo2);
}


