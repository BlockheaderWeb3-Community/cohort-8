use crate::grade::{Grade, Sex};

#[derive(Debug)]
pub struct Student {
    pub id: String,    // UUID string instead of u32
    pub name: String,
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade,
    pub score: f32,
}

impl Student {
    pub fn new(id: String, name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Student {
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
