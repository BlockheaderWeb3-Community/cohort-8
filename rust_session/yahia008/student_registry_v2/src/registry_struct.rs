use crate::student_struct;
use uuid::Uuid;

pub struct Registry {
    students: Vec<student_struct::Student>, // Vec<Student> = "a list of Student values"
               // auto-increment counter for IDs
}