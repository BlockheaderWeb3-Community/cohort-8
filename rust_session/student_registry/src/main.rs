mod grade;
mod registry;
mod registry_with_uuid;
mod student_struct;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use registry_with_uuid::RegistryUuid;
use student_struct::Student;

fn main() {
    // Interacting with the registry using integer IDs
    let mut reg = Registry::new();

    reg.add("Yusrah", 20, Sex::Female, Grade::First, 78.5);
    reg.add("mac", 42, Sex::Female, Grade::Second, 64.0);
    reg.add("shogo", 21, Sex::Female, Grade::First, 91.0);
    reg.add("jason", 16, Sex::Female, Grade::Third, 40.5);

    println!("\n All students (int id) ");
    reg.list_all();

    println!("\n Get student ID 2 ");
    reg.get_student_by_id(2);

    println!("\n Update mac's age to 36 ");
    reg.update_age(2, 36);
    reg.get_student_by_id(2);

    println!("\n Update mac's name ");
    reg.update_name(2, "Mark".to_string());
    reg.get_student_by_id(2);

    println!("\n Update Yusrah's sex ");
    reg.update_sex(1, Sex::Goddess);
    reg.get_student_by_id(1);

    println!("\n Update Yusrah's grade ");
    reg.update_grade(1, Grade::Second);
    reg.get_student_by_id(1);

    println!("\n Delete student ID 3 (shogo) ");
    reg.delete_student(3);

    reg.list_all();

    // Interacting with the registry using UUIDs
    let mut reg_uuid = RegistryUuid::new();

    let id1 = reg_uuid.add("Yusrah", 20, Sex::Female, Grade::First, 78.5);
    let id2 = reg_uuid.add("mac", 42, Sex::Female, Grade::Second, 64.0);

    println!("\n All students (uuid) ");
    reg_uuid.list_all();

    println!("\n Get student by uuid (id2) ");
    reg_uuid.get_student_by_uuid(id2);

    println!("\n Update mac's name (uuid) ");
    reg_uuid.update_name(id2, "Jigah".to_string());
    reg_uuid.get_student_by_uuid(id2);

    println!("\n Delete student (uuid) Yusrah ");
    reg_uuid.delete_student(id1);
    reg_uuid.list_all();
}
