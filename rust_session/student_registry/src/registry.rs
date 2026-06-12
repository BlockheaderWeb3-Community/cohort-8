use crate::grade::{Grade, Sex};
use crate::student_struct::Student;

pub struct Registry {
    pub students: Vec<Student>,
    next_id: u32,
}

impl Registry {
    pub fn new() -> Registry {
        Registry {
            students: Vec::new(),
            next_id: 0,
        }
    }

    pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) {
        let id = self.next_id;
        let student = Student::new(id, name.to_string(), age, sex, grade, score);
        println!("Added: {} (ID {})", student.name, student.id);
        self.students.push(student);
        self.next_id += 1;
    }

    pub fn list_all(&self) {
        if self.students.is_empty() {
            println!("  (no students enrolled yet)");
            return;
        }
        println!(
            "  {:>5}  {:<20}  {:<6}  {:<10}  {}",
            "ID", "Name", "Age", "Grade", "Score"
        );
        println!("  {}", "-".repeat(55));
        for student in &self.students {
            println!(
                "  {:>5}  {:<20}  {:>6}  {:<10}  {:.1}",
                student.id,
                student.name,
                student.age,
                student.grade.as_str(),
                student.score,
            );
        }
    }

    pub fn find_by_id(&self, id: u32) -> Option<&Student> {
        self.students.iter().find(|s| s.id == id)
    }
    // - .iter() loops through the vec without taking ownership
    // - .find() returns the first match wrapped in Option<&Student>
    // - Option means it can be Some(student) if found, or None if not — Rust forces you to handle both cases, no null panics

    pub fn delete(&mut self, id: u32) {
        self.students.retain(|s| s.id != id);
    }
    // - .retain() keeps only elements where the condition is true
    // - So s.id != id means "keep everyone whose id is NOT the one we want to remove"
    // - It mutates the vec in place — no need to find an index

    pub fn update(&mut self, id: u32, name: &str, age: u8, score: f32) {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.name = name.to_string();
            student.age = age;
            student.score = score;
        }
    }
    // - .iter_mut() gives mutable references so you can modify fields in place
    // - if let Some(student) is Rust's clean way to say "if found, do this, otherwise skip"
}
