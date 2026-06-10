use crate::grade::{Grade, Sex};
use crate::student_struct::Student;
use uuid::Uuid;

pub struct Registry {
    pub students: Vec<Student>,
    
}

impl Registry {
    pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) {

        if name.trim().is_empty() {
        println!("Name cannot be empty");
    }

     if name.len() < 2 {
        println!("Name must be at least 2 characters long");
    }
    
    if name.len() > 50 {
        println!("Name cannot exceed 50 characters");
    }
    
    if age < 18 {
        println!("Student must be at least 18 years old");
    }
    
    if age > 100 {
        println!("Age cannot exceed 100 years");
    }
    
    
    if score < 0.0 {
        println!("Score cannot be negative");
    }
    
    if score > 100.0 {
        println!("Score cannot exceed 100");
    }


        let student = Student::new(name.to_string(), age, sex, grade, score);
        println!("Added: {} (ID {})", student.name, student.id);
        self.students.push(student);  
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


    
    pub fn find_by_id(&mut self, id:Uuid) -> Option<&mut Student> {
          self.students.iter_mut().find(|student| student.id == id)
    }

    pub fn update(&mut self, id:Uuid, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) -> Option<&mut Student> {
        if let Some(student) = self.find_by_id(id) {
        student.name = name.to_string();
        student.age = age;
        student.sex = sex;
        student.grade = grade;
        student.score = score;
        Some(student)
    } else {
        None
    }
    }


    pub fn update_age(&mut self, id: Uuid, new_age: u8) -> Option<()> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            if student.age == new_age {
            println!("Name is already '{}', no update needed", student.age);
            return Some(());  
        } else {
            println!("Updated age from '{}' to '{}'", student.age, new_age);
            student.age = new_age;
            return Some(());
        }
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

    pub fn update_name(&mut self, id: Uuid, new_name: String) -> Option<()> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            if student.name == new_name {
            println!("Name is already '{}', no update needed", student.name);
           return Some(());
        } else {
            println!("Updated name from '{}' to '{}'", student.name, new_name);
            student.name = new_name;
            return Some(());
        }
           
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

    #[allow(dead_code)]
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

    #[allow(dead_code)]
    pub fn update_grade(&mut self, id: Uuid, new_grade: Grade) -> Option<()> {
        if let Some(student) = self.students.iter_mut().find(|s| s.id == id) {
            if student.grade == new_grade {
            println!("Grade is already , no update needed");
            return Some(());  
        } else {
            println!("Updated grade from  to '{:?}'", new_grade);
            student.grade = new_grade;
            return Some(());
        }
        } else {
            println!("Student with ID {} not found", id);
            None
        }
    }

     pub fn delete(&mut self, id: Uuid) -> Option<Student> {
        let position = self.students.iter().position(|student| student.id == id);
        
        match position {
            Some(index) => Some(self.students.remove(index)),
            None => None,
        }
    }

    
}
