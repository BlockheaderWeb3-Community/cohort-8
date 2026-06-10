mod grade;
mod registry;
mod student_struct;
mod update_field;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;
use update_field::UpdateField;
// use uuid::Uuid;

fn main() {
    let mut registry = Registry::new();

    // Add a student
    let alice_id = registry.add("Alice", 17, Sex::Female, Grade::First, 86.6);

    let davina_id = registry.add("Davina", 17, Sex::Female, Grade::First, 86.6);

    let mimi_id = registry.add("Mimi", 17, Sex::Female, Grade::Third, 86.6);

    let blessing_id = registry.add("Blessing", 17, Sex::Female, Grade::Second, 86.6);

    // List all students
    registry.list_all();

    println!("------------Update students name----------");
    // Update a student's name (ID 1)
    registry.update_data(alice_id, UpdateField::Name("Sonia".to_string()));
    registry.update_data(davina_id, UpdateField::Name("David".to_string()));
    registry.update_data(mimi_id, UpdateField::Name("Joy".to_string()));
    registry.update_data(blessing_id, UpdateField::Name("Favour".to_string()));

    println!(" -----------Update students age---------- ");
    // update a students score
    registry.update_data(alice_id, UpdateField::Age(20));
    registry.update_data(davina_id, UpdateField::Age(24));
    registry.update_data(mimi_id, UpdateField::Age(28));
    registry.update_data(blessing_id, UpdateField::Age(32));

    println!("------------Update students score----------");
    registry.update_data(alice_id, UpdateField::Score(94.8));
    registry.update_data(davina_id, UpdateField::Score(20.5));
    registry.update_data(mimi_id, UpdateField::Score(60.2));
    registry.update_data(blessing_id, UpdateField::Score(70.3));

    println!("-----------List all students agian to confirm update-------------");
    registry.list_all();
}
