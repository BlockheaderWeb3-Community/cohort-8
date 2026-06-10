mod grade;
mod registry;
mod registry_uuid;
mod registry_struct;
mod student_struct;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use registry_uuid::RegistryUUID;

fn main() {
    // === Registry with u32 IDs
    println!("Registry Table\n");

    let mut registry = Registry::new();

    match registry.add("Kingsman", 20, Sex::Female, Grade::First, 78.5) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    match registry.add("Jigan", 42, Sex::Female, Grade::Second, 64.0) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    match registry.add("Yusrah", 21, Sex::Female, Grade::First, 91.0) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    match registry.add("Testimony", 16, Sex::Female, Grade::Third, 40.5) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }

    // invalid add - empty name
    match registry.add("", 20, Sex::Male, Grade::First, 50.0) {
        Ok(_) => {}
        Err(e) => println!("Rejected: {}", e),
    }

    // invalid add - bad age
    match registry.add("Ghost", 0, Sex::Male, Grade::First, 50.0) {
        Ok(_) => {}
        Err(e) => println!("Rejected: {}", e),
    }

    // invalid add - score out of range
    match registry.add("Ghost", 25, Sex::Male, Grade::First, 120.0) {
        Ok(_) => {}
        Err(e) => println!("Rejected: {}", e),
    }

    println!("\n All students ");
    registry.list_all();

    println!("\n Get student ID 2 ");
    registry.get_student_by_id(2);

    println!("\n Update Jigan's age ");
    match registry.update_age(2, 36) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    registry.get_student_by_id(2);

    // invalid age update
    match registry.update_age(2, 0) {
        Ok(_) => {}
        Err(e) => println!("Rejected: {}", e),
    }

    println!("\n Update Jigan's name ");
    match registry.update_name(2, "Jigah".to_string()) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    registry.get_student_by_id(2);

    // invalid name update
    match registry.update_name(2, "   ".to_string()) {
        Ok(_) => {}
        Err(e) => println!("Rejected: {}", e),
    }

    println!("\n Update Kingsman's sex ");
    match registry.update_sex(1, Sex::Male) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    registry.get_student_by_id(1);

    println!("\n Update Kingsman's grade ");
    match registry.update_grade(1, Grade::Second) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    registry.get_student_by_id(1);

    println!("\n Delete student ID 3 (Yusrah) ");
    match registry.delete_student(3) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    registry.list_all();

    // === Registry with UUID IDs
    println!("\n\nRegistryUUID\n");

    let mut uuid_registry = RegistryUUID::new();

    match uuid_registry.add("Basongo", 23, Sex::Male, Grade::Second, 72.5) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    match uuid_registry.add("Faith", 19, Sex::Female, Grade::First, 88.0) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    match uuid_registry.add("Mac5", 20, Sex::Male, Grade::Third, 55.0) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }

    // invalid add
    match uuid_registry.add("", 20, Sex::Male, Grade::First, 50.0) {
        Ok(_) => {}
        Err(e) => println!("Rejected: {}", e),
    }

    println!("\n All UUID students ");
    uuid_registry.list_all();

    let basongo_id = uuid_registry.students[0].id;
    let faith_id = uuid_registry.students[1].id;

    println!("\n Update Basongo's name ");
    match uuid_registry.update_name(basongo_id, "Ochuko, Isaac Onodairo".to_string()) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    uuid_registry.get_student_by_id(basongo_id);

    println!("\n Delete the first UUID student ");
    match uuid_registry.delete_student(basongo_id) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }

    println!("\n Get UUID of a student");
    uuid_registry.get_student_by_id(faith_id);

    println!("\n Update Faith's age ");
    match uuid_registry.update_age(faith_id, 92) {
        Ok(_) => {}
        Err(e) => println!("Error: {}", e),
    }
    uuid_registry.get_student_by_id(faith_id);

    // invalid age update
    match uuid_registry.update_age(faith_id, 0) {
        Ok(_) => {}
        Err(e) => println!("Rejected: {}", e),
    }

    uuid_registry.list_all();
}
