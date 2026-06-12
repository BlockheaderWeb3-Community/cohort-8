use uuid::Uuid;
use crate::grade::{Grade, Sex};

#[derive(Debug, Clone)]  // add Debug here
pub struct Student {
    pub id: Uuid,
    pub name: String,
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade,
    pub score: f32,
}


impl Student {
    pub fn new(id: Uuid, name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Student {
        Student { id, name, age, sex, grade, score }
    }
}