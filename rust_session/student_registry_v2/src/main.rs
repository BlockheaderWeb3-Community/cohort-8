mod grade;
mod registry;
mod student_struct;

use grade::{Grade, Sex};
use registry::Registry;

fn section(title: &str) {
    let width = 60;
    println!("\n{}", "=".repeat(width));
    println!("{:^width$}", title, width = width);
    println!("{}", "=".repeat(width));
}

fn main() {
    let mut reg = Registry::new();

    section("REGISTERING STUDENTS");
    reg.add("Victor", 20, Sex::Male, Grade::First, 78.5);
    reg.add("Kosi", 22, Sex::Female, Grade::Second, 64.0);
    reg.add("Yusrah", 21, Sex::Female, Grade::First, 91.0);

    section("ALL STUDENTS");
    reg.list_all();

    let first_id = reg.students[0].id.clone();

    // section("FIND BY ID");
    // match reg.find_by_id(&first_id) {
    //     Some(s) => {
    //         println!("  Name   : {}", s.name);
    //         println!("  ID     : {}", s.id);
    //         println!("  Age    : {}", s.age);
    //         println!("  Sex    : {}", s.sex.to_str());
    //         println!("  Grade  : {}", s.grade.as_str());
    //         println!("  Score  : {:.1}", s.score);
    //     }
    //     None => println!("  Not found"),
    // }

    // section("UPDATE STUDENT");
    // reg.update(&first_id, "Victor Updated", 21, 85.0);
    // println!();
    // reg.list_all();

    section("DELETE STUDENT");
    reg.delete(&first_id);
    reg.list_all();
}
