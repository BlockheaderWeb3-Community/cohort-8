use crate::grade::{Grade, Sex};

// A struct groups related pieces of data under one name.
// Think of it as a custom data type you design yourself.

#[derive(Debug)]
pub struct Student {
    pub id: u32,      // u32  = unsigned 32-bit integer (no negatives)
    pub name: String, // String = heap-allocated, growable text
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade, // our own enum type from above
    pub score: f32,
}

// This is the implementation of the student struct with its corresponding methods
impl Student {
    
    pub fn new(id: u32, name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Student {
        Student {
            id,
            name,
            age,
            sex,
            grade,
            score,
        }
    }
}

#[derive(Debug)]
pub enum Status {
    Pending,
    Ongoing,
    Completed,
}

pub struct Todo {
    id: u8,
    title: String,
    description: String,
    status: Status,
}
