use crate::grade::{Grade, Sex};
use crate::student_struct::Student;
use uuid::Uuid;

pub struct Registry {
    pub students: Vec<Student>,
}

impl Registry {
    pub fn new(students: Vec<Student>) -> Registry { 
        Registry{students} 
    }

    pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) {
        let id = Uuid::new_v4();
        let student = Student::new(id, name.to_string(), age, sex, grade, score);
        println!("Added: {} (ID {})", student.name, student.id);
        self.students.push(student);
    }

    pub fn list_all(&self) {
        if self.students.is_empty() {
            println!("  (no students enrolled yet)");
            return;
        }
        println!("  {:<36}  {:<20}  {:<6}  {:<10}  {}", "ID", "Name", "Age", "Grade", "Score");
        println!("  {}", "-".repeat(80));
        for student in &self.students {
            println!(
                "  {:<36}  {:<20}  {:>6}  {:<10}  {:.1}",
                student.id, student.name, student.age, student.grade.as_str(), student.score,
            );
        }
    }

    pub fn find_by_id(&self, id: Uuid) -> Option<&Student> {
        self.students.iter().find(|s| s.id == id)
    }

    pub fn get_student(&self, id: Uuid) {
        match self.find_by_id(id) {
            Some(s) => println!(
                "ID: {}, Name: {}, Age: {}, Grade: {:?}, Score: {}",
                s.id, s.name, s.age, s.grade, s.score
            ),
            None => println!("Student with ID {} not found.", id),
        }
    }

    pub fn update_name(&mut self, id: Uuid, new_name: &str) {
        match self.students.iter_mut().find(|s| s.id == id) {
            Some(s) => s.name = new_name.to_string(),
            None => println!("Student with ID {} not found.", id),
        }
    }

    pub fn update_age(&mut self, id: Uuid, new_age: u8) {
        match self.students.iter_mut().find(|s| s.id == id) {
            Some(s) => s.age = new_age,
            None => println!("Student with ID {} not found.", id),
        }
    }

    pub fn update_grade(&mut self, id: Uuid, input: &str) {
        let new_grade = match input.to_lowercase().as_str() {
            "first"  => Some(Grade::First),
            "second" => Some(Grade::Second),
            "third"  => Some(Grade::Third),
            _ => { println!("Unknown grade: {}", input); None }
        };
        if let Some(grade) = new_grade {
            match self.students.iter_mut().find(|s| s.id == id) {
                Some(s) => s.grade = grade,
                None => println!("Student with ID {} not found.", id),
            }
        }
    }

    pub fn delete_student(&mut self, id: Uuid) {
        match self.students.iter().position(|s| s.id == id) {
            Some(index) => {
                self.students.remove(index);
                println!("Deleted student {}", id);
            }
            None => println!("Student with ID {} not found.", id),
        }
    }
}