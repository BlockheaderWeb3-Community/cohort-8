use std::io;
use colored::*;

mod grade;
mod registry;
mod student_struct;
mod utils;

use grade::{Grade, Sex};
use registry::Registry;
use student_struct::Student;
use uuid::Uuid;

fn main() {
     let mut registry = Registry::new(vec![]);

    
    println!("");
    println!("");
    println!("{}", "==========================".yellow());
    println!("{}", "STUDENT REGISTRY".yellow().bold());
    println!("{}", "==========================".yellow().bold());
    
    loop {
        println!("");
        
        println!("{}", "____Choose An Option____".bright_green().black());
        println!("");
        println!("{}", "1. Add Student".black().bold());
        println!("{}", "2. Get A Student".black().bold());
        println!("{}", "3. All Students".black().bold());
        println!("{}", "4. Update Student Name".black().bold());
        println!("{}", "5. Update Student Age".black().bold());
        println!("{}", "6. Update Student Grade".black().bold());
        println!("{}", "7. Update Student Score".black().bold());
        println!("{}", "8. Delete Student".black().bold());

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
                let id = get_uuid_input("Fill In *ID* Input");
                registry.get_student(id);
            }
            "3" => {
                registry.list_all();
            }
            "4" => {
                let new_name = get_string_input("Fill In *Name* Input");
                let id = get_uuid_input("Fill In *ID* Input");

                registry.update_name(id, &new_name);
            }
            "5" => {
                let id = get_uuid_input("Fill In *ID* Input");
                let new_age = get_num_input("Fill In *Age* Input");
                registry.update_age(id, new_age);
            }
            "6" => {
                let grade = get_string_input("Fill In *Grade* Input");
                let id = get_uuid_input("Fill In *ID* Input");

                registry.update_grade(id, &grade);
            }
            "7" => {
                let new_score = get_fp_input("Fill In *Grade* Input");
                let id = get_uuid_input("Fill In *ID* Input");

                registry.update_score(id, new_score);
            }
             "8" => {
                let id = get_uuid_input("Fill In *ID* Input");
                registry.delete_student(id);
            }
            _ => {
                println!("/////////");
                println!("Invalid Input");
                println!("/////////");
            }
        }

        
    }
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

fn get_uuid_input(prompt: &str) -> Uuid {
    println!("{}", prompt);
    let mut num_input = String::new();
    io::stdin().read_line(&mut num_input).expect("Feailed to read line");
    let num_input: Uuid = num_input.trim().parse().expect("Failed to parse");
    num_input
}

fn get_fp_input(prompt: &str) -> f32 {
    println!("{}", prompt);
    let mut num_input = String::new();
    io::stdin().read_line(&mut num_input).expect("Feailed to read line");
    let num_input: f32 = num_input.trim().parse().expect("Failed to parse");
    num_input
}