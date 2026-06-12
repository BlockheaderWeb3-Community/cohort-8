use crate::grade::{Grade, Sex};
use crate::student_struct::Student;

pub struct Registry {
    pub students: Vec<Student>,
    next_id: u32,
}

impl Registry {
    
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

    pub fn delete_by_id(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) {
        if let Some(pos) = self.students.iter().position(|student| {
                 student.name == name
                && student.age == age
                && student.sex == sex
                && student.grade == grade
                && (student.score - score).abs() < f32::EPSILON
        }) {
            let student = self.students.remove(pos);
            println!("Deleted: {} (ID {})", student.name, student.id);
        } else {
            println!("No matching student found to delete: {}", name);
        }
    }

    pub fn update_by_id(&mut self, id: u32, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) {
        if let Some(student) = self.students.iter_mut().find(|student| student.id == id) {
            student.name = name.to_string();
            student.age = age;
            student.sex = sex;
            student.grade = grade;
            student.score = score;
            println!("Updated: {} (ID {})", student.name, student.id);
        } else {
            println!("No matching student found to update with ID: {}", id);
        }
    }

    pub fn find_id(&self, id: u32) -> Option<&Student> {
        self.students.iter().find(|student| student.id == id)
    }
}
