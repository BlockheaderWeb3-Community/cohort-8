use crate::grade::{Grade, Sex};
use crate::student_struct::StudentV2;
use uuid::Uuid;

pub struct RegistryUUID {
    pub students: Vec<StudentV2>,
}

impl RegistryUUID {
    pub fn new() -> RegistryUUID {
        RegistryUUID {
            students: Vec::new(),
        }
    }

    // === Add student to registry
    pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) -> Result<(), String> {
        let student = StudentV2::new(name.to_string(), age, sex, grade, score)?;
        println!("Added: {} with the following ID - {}", student.name, student.id);
        self.students.push(student);
        Ok(())
    }

    // === List all students
    pub fn list_all(&self) {
        if self.students.is_empty() {
            println!("  (no students enrolled yet)");
            return;
        }
        println!(
            "  {:<38}  {:<20}  {:<6}  {:<8}  {:<10}  {}",
            "ID", "Name", "Age", "Sex", "Grade", "Score"
        );
        println!("  {}", "-".repeat(95));
        for student in &self.students {
            println!(
                "  {:<38}  {:<20}  {:>6}  {:<8}  {:<10}  {:.1}",
                student.id,
                student.name,
                student.age,
                student.sex.as_str(),
                student.grade.as_str(),
                student.score,
            );
        }
    }

    // === Get student by UUID
    pub fn get_student_by_id(&self, id: Uuid) {
        if let Some(student) = self.students.iter().find(|s| s.id == id) {
            println!("{:?}", student);
        } else {
            println!("Student with ID {} not found", id);
        }
    }

    // === Update fields
    pub fn update_age(&mut self, id: Uuid, new_age: u8) -> Result<(), String> {
        if new_age == 0 || new_age > 100 {
            return Err(format!("Invalid age: {}", new_age));
        }
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.age = new_age;
            println!("Updated age for student ID {}", id);
            Ok(())
        } else {
            Err(format!("Student with ID {} not found", id))
        }
    }

    pub fn update_name(&mut self, id: Uuid, new_name: String) -> Result<(), String> {
        if new_name.trim().is_empty() {
            return Err("Name cannot be empty".to_string());
        }
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.name = new_name;
            println!("Updated name for student ID {}", id);
            Ok(())
        } else {
            Err(format!("Student with ID {} not found", id))
        }
    }

    #[allow(dead_code)]
    pub fn update_sex(&mut self, id: Uuid, new_sex: Sex) -> Result<(), String> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.sex = new_sex;
            println!("Updated sex for student ID {}", id);
            Ok(())
        } else {
            Err(format!("Student with ID {} not found", id))
        }
    }

    #[allow(dead_code)]
    pub fn update_grade(&mut self, id: Uuid, new_grade: Grade) -> Result<(), String> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.grade = new_grade;
            println!("Updated grade for student ID {}", id);
            Ok(())
        } else {
            Err(format!("Student with ID {} not found", id))
        }
    }

    pub fn delete_student(&mut self, id: Uuid) -> Result<(), String> {
        if let Some(index) = self.students.iter().position(|s| s.id == id) {
            self.students.remove(index);
            println!("Deleted student ID {}", id);
            Ok(())
        } else {
            Err(format!("Student with ID {} not found", id))
        }
    }
}
