mod grade;
mod registry;
mod student_struct;
mod update_field;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;
use update_field::UpdateField;

fn main() {
    let mut registry = Registry::new();

    // Add a student
    registry.add("Alice", 17, Sex::Female, Grade::First, 86.6);

    registry.add("Davina", 17, Sex::Female, Grade::First, 86.6);

    registry.add("Mimi", 17, Sex::Female, Grade::Third, 86.6);

    registry.add("Blessing", 17, Sex::Female, Grade::Second, 86.6);

    // List all students
    registry.list_all();

    println!("");

    registry.get_student(1);
    registry.get_student(2);
    registry.get_student(3);
    registry.get_student(4);

    println!("----------------------------------------------");

    println!("------------Update students name----------");
    // Update a student's name (ID 1)
    registry.update_data(1, UpdateField::Name("Sonia".to_string()));
    registry.update_data(2, UpdateField::Name("David".to_string()));
    registry.update_data(3, UpdateField::Name("Joy".to_string()));
    registry.update_data(4, UpdateField::Name("Favour".to_string()));

    println!(" -----------Update students age---------- ");
    // update a students score
    registry.update_data(1, UpdateField::Age(20));
    registry.update_data(2, UpdateField::Age(24));
    registry.update_data(3, UpdateField::Age(28));
    registry.update_data(4, UpdateField::Age(32));

    println!("------------Update students score----------");
    registry.update_data(1, UpdateField::Score(94.8));
    registry.update_data(2, UpdateField::Score(20.5));
    registry.update_data(3, UpdateField::Score(60.2));
    registry.update_data(4, UpdateField::Score(70.3));

    println!("-----------List all students agian to confirm update-------------");
    registry.list_all();

    // registry.delete_student(1);
    // registry.delete_student(2);
    // registry.delete_student(3);
    // registry.delete_student(4);

    // println!("-----------List all students agian to confirm delete-------------");
    // registry.list_all();
}
