use crate::grade::{Grade, Sex};
use crate::student_struct::Student;
use crate::update_field::UpdateField;

pub struct Registry {
    pub students: Vec<Student>,
    next_id: u32,
}

impl Registry {
    pub fn new() -> Self {
        Registry {
            students: Vec::new(),
            next_id: 1,
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

    pub fn get_student(&self, id: u32) {
        match self.students.iter().find(|s| s.id == id) {
            Some(student) => println!(
                "ID: {} | Name: {} | Age: {} | Sex: {:?} | Grade: {:?} | Score: {}" ,
                student.id, student.name, student.age,student.sex,  student.grade, student.score
            ),
            None => println!("No student found with ID {}", id),
        }
    }

    // This function takes in the student ID to know which student and takes in fields which type is the updateFiled Enum
    // So that it knows what to change.
    pub fn update_data(&mut self, id: u32, field: UpdateField) {
        match self.students.iter_mut().find(|s| s.id == id) {
            Some(student_data) => {
                println!("Update {} for student ID {}", field.label(), id);
                field.apply(student_data);
            }

            None => println!("No Student Found with this id {} ", id),
        }
    }

    // It goes through the vector and keeps every student where the condition is true, and removes any student where it's false.
    pub fn delete_student(&mut self, id: u32) {
        self.students.retain(|student| student.id != id);
    }
}
