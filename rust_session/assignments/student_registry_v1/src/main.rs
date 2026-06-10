use std::io;

mod grade;
mod registry;
mod student_struct;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;

fn main() {
    let mut registry = Registry::new(vec![], 1);

    
    println!("");
    println!("");
    println!("==========================");
    println!("STUDENT REGISTRY");
    println!("==========================");
    
    loop {
        println!("");
        
        println!(" Choose An Option");
        println!("");
        println!("1. Add Student");
        println!("2. Get A Student");
        println!("3. All Students");
        println!("4. Update Student Name");
        println!("5. Update Student Age");
        println!("6. Update Student Grade");
        println!("7. Update Student Score");
        println!("8. Delete Student");

        println!("");

        let mut choice_input = String::new();
        io::stdin().read_line(&mut choice_input).expect("Failed to read line");
        let choice_input = choice_input.trim();
        println!("");
    println!("");

        match choice_input {
            "1" => {
                    let name = get_string_input("Fill In *Name* Input");
                    let grade = get_string_input("Fill In *Grade* Input");
                    let sex = get_string_input("Fill In *Sex* Input");
                    let age = get_num_input("Fill In *Age* Input");
                    let score = get_fp_input("Fill In *Score* Input");
                registry.add(&name, &sex, &grade, score, age);
            }
            "2" => {
                let id = get_num_input("Fill In *ID* Input");
                registry.get_student(id);
            }
            "3" => {
                registry.list_all();
            }
            "4" => {
                let new_name = get_string_input("Fill In *Name* Input");
                let id = get_num_input("Fill In *ID* Input");

                registry.update_name(id, &new_name);
            }
            "5" => {
                let id = get_num_input("Fill In *ID* Input");
                let new_age = get_num_input("Fill In *Age* Input");
                registry.update_age(id, new_age);
            }
            "6" => {
                let grade = get_string_input("Fill In *Grade* Input");
                let id = get_num_input("Fill In *ID* Input");

                registry.update_grade(id, &grade);
            }
            "7" => {
                let new_score = get_fp_input("Fill In *Grade* Input");
                let id = get_num_input("Fill In *ID* Input");

                registry.update_score(id, new_score);
            }
             "8" => {
                let id = get_num_input("Fill In *ID* Input");
                registry.delete_student(id);
            }
            _ => {
                println!("/////////");
                println!("Invalid Input");
                println!("/////////");
            }
        }

        
    }
    








    // let s: Student = Student::new(1, String::from("Testimony"), 16, Sex::Female, Grade::Third, 40.5);
    // let b: Student = Student::new(2, String::from("Henry"), 20, Sex::Male, Grade::Third, 70.5);

    // let student_vec = vec![s, b];
    
    // let registry = Registry::new(student_vec, 1);

    // registry.get_student(1);
    // // println!("student1 is: {:?}", student1);

}

fn get_string_input(prompt: &str) -> String {
    println!("{}", prompt);
    let mut input = String::new();
    io::stdin().read_line(&mut input).expect("Failed to read line");
    input.trim().to_string()
}

fn get_num_input(prompt: &str) -> u32 {
    println!("{}", prompt);
    let mut num_input = String::new();
    io::stdin().read_line(&mut num_input).expect("Feailed to read line");
    let num_input: u32 = num_input.trim().parse().expect("Failed to parse");
    num_input
}

fn get_fp_input(prompt: &str) -> f32 {
    println!("{}", prompt);
    let mut num_input = String::new();
    io::stdin().read_line(&mut num_input).expect("Feailed to read line");
    let num_input: f32 = num_input.trim().parse().expect("Failed to parse");
    num_input
}