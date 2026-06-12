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

    // let sex = Sex::Male;
    // println!("sex: {:?}", sex.to_str());

    // let s: Student = Student::new(1, String::from("Testimony"), 16, Sex::Female, Grade::Third, 40.5);
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

    
    let mut reg = Registry::new(vec![]);

    reg.add("Testimony", 20, Sex::Female, Grade::Second, 20.5);
    reg.add("Basongo", 22, Sex::Male, Grade::First, 72.0);

    reg.list_all();

    // i cant get guess a UUID ,  so i need to grab the id first
    if let Some(student) = reg.students.first() {
        let id = student.id;  // capture the Uuid

        println!("\n--- Found by UUID ---");
        reg.get_student(id);

        println!("\n--- Update name ---");
        reg.update_name(id, "Alice Updated");
        reg.get_student(id);

        println!("\n--- Delete ---");
        reg.delete_student(id);
    }

    reg.list_all();

}
