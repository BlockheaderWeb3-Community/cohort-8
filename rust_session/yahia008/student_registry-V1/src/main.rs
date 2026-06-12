mod grade;
mod registry;
mod student_struct;


use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;

fn main() {
   let mut registry = Registry {
        students: Vec::new(),
        next_id: 0, 
    };

    registry.add("yusrah", 20, Sex::Female, Grade::First, 85.5);
    registry.add("Dave", 22, Sex::Male, Grade::Second, 92.0);
    registry.add("basongs", 19, Sex::Male, Grade::Third, 78.5);

    println!("\nAll students:");
    registry.list_all();


    println!("\nUpdating student with ID 1...");
    if let Some(student) = registry.update(0, "jiggs", 21, Sex::Male, Grade::Second, 88.0) {
        println!("Updated: {} (ID {})", student.name, student.id);
    } else {
        println!("Student not found");
    }

     println!("\nAfter update:");
    registry.list_all();

    println!("\nFinding student with ID 2...");
    if let Some(student) = registry.find_by_id(2) {
        println!("Found: {} (ID {}, Age: {})", student.name, student.id, student.age);
    }
    
    println!("\nDeleting student with ID 2...");
    if let Some(deleted) = registry.delete(2) {
        println!("Deleted: {} (ID {})", deleted.name, deleted.id);
    }

    println!("\nAfter deletion:");
    registry.list_all();

}
