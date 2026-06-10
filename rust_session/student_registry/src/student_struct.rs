use crate::grade::{Grade, Sex};
use uuid::Uuid;

#[derive(Debug)]
pub struct Student {
    pub id: u32,
    pub name: String,
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade,
    pub score: f32,
}

impl Student {
    pub fn new(id: u32, name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Result<Student, String> {
        if name.trim().is_empty() {
            return Err("Name cannot be empty".to_string());
        }
        if age == 0 || age > 100 {
            return Err(format!("Invalid age: {}", age));
        }
        if score < 0.0 || score > 100.0 {
            return Err(format!("Score must be between 0 and 100, got {}", score));
        }
        Ok(Student {
            id,
            name: name.trim().to_string(),
            age,
            sex,
            grade,
            score,
        })
    }
}

#[derive(Debug)]
pub struct StudentV2 {
    pub id: Uuid,
    pub name: String,
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade,
    pub score: f32,
}

impl StudentV2 {
    pub fn new(name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Result<StudentV2, String> {
        if name.trim().is_empty() {
            return Err("Name cannot be empty".to_string());
        }
        if age == 0 || age > 100 {
            return Err(format!("Invalid age: {}", age));
        }
        if score < 0.0 || score > 100.0 {
            return Err(format!("Score must be between 0 and 100, got {}", score));
        }
        Ok(StudentV2 {
            id: Uuid::new_v4(),
            name: name.trim().to_string(),
            age,
            sex,
            grade,
            score,
        })
    }
}

#[allow(dead_code)]
#[derive(Debug)]
pub enum Status {
    Pending,
    Ongoing,
    Completed,
}

#[allow(dead_code)]
pub struct Todo {
    pub id: u8,
    pub title: String,
    pub description: String,
    pub status: Status,
}
