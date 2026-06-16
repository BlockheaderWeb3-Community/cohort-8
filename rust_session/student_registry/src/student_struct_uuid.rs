use crate::grade::{Grade, Sex};
use uuid::Uuid;

// A struct groups related pieces of data under one name.
// Think of it as a custom data type you design yourself.

#[derive(Debug)]
pub struct Student {
    pub id: Uuid,     // u32  = unsigned 32-bit integer (no negatives)
    pub name: String, // String = heap-allocated, growable text
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade, // our own enum type from above
    pub score: f32,
}

// This is the implementation of the student struct with its corresponding methods
impl Student {
    pub fn new(name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Student {
        Student {
            id: Uuid::new_v4(),
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
    id: Uuid,
    title: String,
    description: String,
    status: Status,
}
