use uuid::Uuid;

use crate::grade::{Grade, Sex};
use crate::student_struct::Student;

pub struct Registry {
    pub students: Vec<Student>,
}

impl Registry {
    pub fn new() -> Registry {
        Registry {
            students: Vec::new(),
        }
    }

    pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) {
        let id = Uuid::new_v4().to_string();
        let student = Student::new(id, name.to_string(), age, sex, grade, score);
        println!("  [+] Registered: {:<16} (ID: {})", student.name, student.id);
        self.students.push(student);
    }

    pub fn list_all(&self) {
        if self.students.is_empty() {
            println!("  (no students enrolled yet)");
            return;
        }
        println!(
            "  {:<36}  {:<16}  {:<4}  {:<8}  {:<9}  {}",
            "ID", "Name", "Age", "Sex", "Grade", "Score"
        );
        println!("  {}", "-".repeat(87));
        for student in &self.students {
            println!(
                "  {:<36}  {:<16}  {:<4}  {:<8}  {:<9}  {:.1}",
                student.id,
                student.name,
                student.age,
                student.sex.to_str(),
                student.grade.as_str(),
                student.score,
            );
        }
    }

    // Returns a shared reference to the student if found, or None
    pub fn find_by_id(&self, id: &str) -> Option<&Student> {
        self.students.iter().find(|s| s.id == id)
        // ------ in javascript -------
        // this.students.find(s => s.id === id)
    }

    // Updates name, age, and score for the student with the given id
    pub fn update(&mut self, id: &str, name: &str, age: u8, score: f32) {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.name = name.to_string();
            student.age = age;
            student.score = score;
            println!("  [~] Updated: {} (ID: {})", student.name, id);
        } else {
            println!("  [!] Student with ID {} not found", id);
        }
    }

    // Removes the student with the given id from the registry
    pub fn delete(&mut self, id: &str) {
        let before = self.students.len();
        self.students.retain(|s| s.id != id);
        if self.students.len() < before {
            println!("  [-] Deleted student with ID: {}", id);
        } else {
            println!("  [!] Student with ID {} not found", id);
        }
    }
}
