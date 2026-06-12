mod grade;
mod registry;
mod student_struct;
// mod utils;

use grade::{Grade, Sex};
use registry::Registry;
// use student_struct::Student;

fn main() {
    // let g = Grade::Second;
    // println!("{}", g.as_str()); // "2nd Year"
    // println!("{:?}", g);

    // let ss = Student::new();
    // println!("stund")

    let mut reg = Registry::new();
    
    reg.add("Victor", 20, Sex::Male, Grade::First, 78.5,);
    reg.add("Kosi", 22, Sex::Female, Grade::Second, 64.0);
    reg.add("Yusrah", 21, Sex::Female, Grade::First, 91.0);

    reg.list_all();


    let second_id = reg.students[1].id.clone();

    match reg.find_by_id(second_id) {
        Some(student) => println!("Found student: {} with ID: {}", student.name, student.id),
        None => println!("Student not found"),
    }

    reg.update(second_id, "joy", 25, 50.0);
    println!();
    reg.list_all();




    // let sex = Sex::Male;
    // println!("sex: {:?}", sex.to_str());

    // // let s: Student = Student::new(1, String::from("Testimony"), 16, Sex::Female, Grade::Third, 40.5);
    // let s: Student = Student::new(
    //     1,
    //     "Testimony".to_string(),
    //     16,
    //     Sex::Female,
    //     Grade::Third,
    //     40.5,
    // );
    // println!("student here: {:#?}", s);

    // println!("student id: {}", s.id);
    // println!("student name: {}", s.name);
    // println!("student age: {}", s.age);
}
