// A Rust program to manage a student registry without UUIDs.
mod grade;
mod registry;
mod student_struct;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;

fn main() {
    fn print_separator() {
        println!("                                                          ");
        println!("==========================================================");
        println!("==========================================================");
        println!("                                                          ");
    }

    let sex = Sex::Male;
    println!("sex: {:?}", sex.to_str());

    let s: Student = Student::new(
        1,
        String::from("Testimony"),
        16,
        Sex::Female,
        Grade::Third,
        40.5,
    );

    let mut registry = Registry::new();
    registry.add("Testimony", 16, Sex::Female, Grade::Third, 40.5);
    registry.add("John", 17, Sex::Male, Grade::First, 88.0);
    registry.add("James", 17, Sex::Male, Grade::First, 75.0);
    registry.add("Fin", 17, Sex::Female, Grade::First, 12.0);
    registry.list_all();
    registry.add("Mark", 20, Sex::Male, Grade::First, 72.0);
    registry.add("Janet", 20, Sex::Female, Grade::First, 82.0);
    let custom_id = registry.students[2].id;
    print_separator();
    registry.list_all();
    let updated_student: Student =
        Student::new(3, "Fin".to_string(), 17, Sex::Female, Grade::First, 12.0);
    print_separator();
    registry.update(3, updated_student);
    print_separator();
    registry.list_all();
    print_separator();
    registry.delete(3);
    print_separator();
    registry.list_all();
    registry.delete(custom_id);
    print_separator();
    registry.list_all();
}

// A Rust program to manage a student registry with UUIDs.

// mod grade;
// mod registry_uuid;
// mod student_struct_uuid;
// mod utils;

// use grade::{Grade, Sex};
// use registry_uuid::Registry;
// use student_struct_uuid::Student;

// fn main() {
//     let sex = Sex::Male;
//     println!("sex: {:?}", sex.to_str());

//     let s: Student = Student::new("Testimony".to_string(), 16, Sex::Female, Grade::Third, 40.5);

//     let mut registry = Registry::new();
//     registry.add("Testimony", 16, Sex::Female, Grade::Third, 40.5);
//     registry.add("John", 17, Sex::Male, Grade::First, 88.0);
//     registry.add("James", 17, Sex::Male, Grade::First, 75.0);
//     registry.add("Fin", 17, Sex::Female, Grade::First, 12.0);
//     registry.list_all();
//     registry.add("Mark", 20, Sex::Male, Grade::First, 72.0);
//     registry.add("Janet", 20, Sex::Female, Grade::First, 82.0);
//     let custom_id = registry.students[2].id;
//     registry.list_all();
//     let updated_student: Student =
//         Student::new("Fin".to_string(), 18, Sex::Female, Grade::Third, 40.5);
//     registry.list_all();
//     registry.delete(custom_id);
// }
