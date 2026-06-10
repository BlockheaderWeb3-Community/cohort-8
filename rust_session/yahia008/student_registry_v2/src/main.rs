mod grade;
mod registry;
mod student_struct;


use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;
use uuid::Uuid;
fn main() {
   let mut registry = Registry {
        students: Vec::new(),
        
    };

    registry.add("yusrah", 20, Sex::Female, Grade::First, 85.5);
    registry.add("Dave", 22, Sex::Male, Grade::Second, 92.0);
    registry.add("basongs", 19, Sex::Male, Grade::Third, 78.5);

    println!("\nAll students:");
    registry.list_all();

    let first_student_id = registry.students[0].id;
    let second_student_id = registry.students[1].id;
    let third_student_id = registry.students[2].id;

    

    
    
    println!("\nUpdating student with ID {}...", first_student_id);
    if let Some(student) = registry.update(first_student_id, "pragon", 16, Sex::Female, Grade::Second, 88.0) {
        println!("Updated: {} (ID {})", student.name, student.id);
    } else {
        println!("Student not found");
    }

    println!("\nAfter update:");
    registry.list_all();

    println!("\nMaking multiple updates to first_student:");
    registry.update_name(first_student_id, "sami".to_string());
    registry.update_age(first_student_id, 32);
    registry.update_grade(first_student_id, Grade::Third);
    
    println!("\nAfter multiple updates:");
    registry.list_all();

    println!("\nFinding student by ID...");
    if let Some(student) = registry.find_by_id(first_student_id) {
        println!("Found: {} (ID {}, Age: {})", student.name, student.id, student.age);
    }

    
    println!("\nDeleting student with ID {}...", second_student_id);
    if let Some(deleted) = registry.delete(second_student_id) {
        println!("Deleted: {} (ID {})", deleted.name, deleted.id);
    }

    
    println!("\nAfter deletion:");
    registry.list_all();

    let specific_uuid = Uuid::new_v4(); 
    println!("\nTrying to find non-existent student with UUID {}...", specific_uuid);
    if let Some(student) = registry.find_by_id(specific_uuid) {
        println!("Found: {}", student.name);
    } else {
        println!("No student found with that UUID");
    }
    


}