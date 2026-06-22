use crate::grade::{Grade, Sex};
use uuid::Uuid;

pub struct StudentUuid {
    pub id: Uuid,
    pub name: String,
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade,
    pub score: f32,
}

impl StudentUuid {
    pub fn new(id: Uuid, name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Self {
        StudentUuid { id, name, age, sex, grade, score }
    }
}

pub struct RegistryUuid {
    pub students: Vec<StudentUuid>,
}

impl RegistryUuid {
    pub fn new() -> Self {
        RegistryUuid { students: Vec::new() }
    }

    pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) -> Uuid {
        let id = Uuid::new_v4();
        let student = StudentUuid::new(id, name.to_string(), age, sex, grade, score);
        println!("Added: {} (ID {})", student.name, student.id);
        self.students.push(student);
        id
    }

    pub fn list_all(&self) {
        if self.students.is_empty() {
            println!("  (no students enrolled yet)");
            return;
        }
        println!("  {:<36}  {:<20}  {:<6}  {:<10}  {}", "ID", "Name", "Age", "Grade", "Score");
        println!("  {}", "-".repeat(95));
        for student in &self.students {
            println!(
                "  {:<36}  {:<20}  {:>6}  {:<10}  {:.1}",
                student.id.to_string(),
                student.name,
                student.age,
                student.grade.as_str(),
                student.score
            );
        }
    }

    pub fn get_student_by_uuid(&self, id: Uuid) -> Option<&StudentUuid> {
        if let Some(student) = self.students.iter().find(|s| s.id == id) {
            println!("Found: {} (ID {})", student.name, student.id);
            Some(student)
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

    pub fn update_name(&mut self, id: Uuid, new_name: String) -> Option<()> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.name = new_name;
            println!("Updated name for student ID {}", id);
            Some(())
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

    pub fn update_age(&mut self, id: Uuid, new_age: u8) -> Option<()> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.age = new_age;
            println!("Updated age for student ID {}", id);
            Some(())
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

    pub fn update_sex(&mut self, id: Uuid, new_sex: Sex) -> Option<()> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.sex = new_sex;
            println!("Updated sex for student ID {}", id);
            Some(())
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

    pub fn update_grade(&mut self, id: Uuid, new_grade: Grade) -> Option<()> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            student.grade = new_grade;
            println!("Updated grade for student ID {}", id);
            Some(())
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

    pub fn delete_student(&mut self, id: Uuid) -> Option<()> {
        if let Some(pos) = self.students.iter().position(|s| s.id == id) {
            let removed = self.students.remove(pos);
            println!("Deleted: {} (ID {})", removed.name, removed.id);
            Some(())
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }
}
