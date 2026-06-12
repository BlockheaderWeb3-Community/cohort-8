mod grade;
mod registry;
mod student_struct;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;

fn main() {
    // let g = Grade::Second;
    // println!("{}", g.as_str()); // "2nd Year"
    // println!("{:?}", g);

    // let ss = Student::new();
    // println!("stund")

    // let mut reg = Registry::new();

    // reg.add("Victor", 20, Grade::First, 78.5);
    // reg.add("Kosi", 22, Grade::Second, 64.0);
    // reg.add("Yusrah", 21, Grade::First, 91.0);

    // reg.list_all();]

    let sex = Sex::Male;
    println!("sex: {:?}", sex.to_str());

    // let s: Student = Student::new(1, String::from("Testimony"), 16, Sex::Female, Grade::Third, 40.5);
    let s: Student = Student::new(
        1,
        "Testimony".to_string(),
        16,
        Sex::Female,
        Grade::Third,
        40.5,
    );
    println!("student here: {:#?}", s);

    println!("student id: {}", s.id);
    println!("student name: {}", s.name);
    println!("student age: {}", s.age);
}
