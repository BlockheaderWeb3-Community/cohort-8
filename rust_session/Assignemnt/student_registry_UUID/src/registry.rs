
use crate::grade::{Grade, Sex};
use crate::student_struct::Student;
use crate::update_field::UpdateField;
use uuid::Uuid;


pub struct Registry {
    pub students: Vec<Student>
}

impl Registry {
    pub fn new() -> Self {
        Registry {
            students: Vec::new()        }
    }

    pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) -> Uuid {
        let id = Uuid::new_v4(); // generates a unique ID automatically
        let student = Student::new(id, name.to_string(), age, sex, grade, score);
        println!("Added: {} (ID {})", student.name, student.id);
        self.students.push(student);
        id // return the id so the caller can store it
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

    pub fn get_student(&self, id: Uuid) {
        match self.students.iter().find(|s| s.id == id) {
            Some(student) => println!(
                "ID: {} | Name: {} | Age: {} | Grade: {:?} | Score: {}",
                student.id, student.name, student.age, student.grade, student.score
            ),
            None => println!("No student found with ID {}", id),
        }
    }

    // This function takes in the student ID to know which student and takes in fields which type is the updateFiled Enum
    // So that it knows what to change.
    pub fn update_data(&mut self, id: Uuid, field: UpdateField) {
        match self.students.iter_mut().find(|s| s.id == id) {
            Some(student_data) => {
                println!("Update {} for student ID {}", field.label(), id);
                field.apply(student_data);
            }

            None => println!("No Student Found with this id {} ", id),
        }
    }

    pub fn delete_student(&mut self, id: Uuid) {
        // It goes through the vector and keeps every student where the condition is true, and removes any student where it's false.
        self.students.retain(|student| student.id != id);
    }
}
