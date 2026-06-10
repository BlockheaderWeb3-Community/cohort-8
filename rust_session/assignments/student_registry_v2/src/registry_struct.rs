use crate::student_struct;

pub struct Registry {
    students: Vec<student_struct::Student>, // Vec<Student> = "a list of Student values"
    next_id: u32,           // auto-increment counter for IDs
}