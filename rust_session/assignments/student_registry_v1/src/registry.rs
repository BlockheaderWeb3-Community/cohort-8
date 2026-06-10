use crate::grade::{Grade, Sex};
use crate::student_struct::Student;

#[derive(Clone)]
pub struct Registry {
    pub students: Vec<Student>,
    next_id: u32,
}

impl Registry {
    pub fn new(student: Vec<Student>, id: u32) -> Registry {
        Registry { 
            students: student, 
            next_id: id 
        }
    }

    pub fn add(&mut self, name: &str, sex: &str, grade: &str, score: f32, age: u32) {
        let id = self.next_id;
        
        let sex_x = if sex.to_lowercase().contains("male"){
            Sex::Male
        }else if sex.to_lowercase().contains("female") {
            Sex::Female
        }else {
            Sex::None
        };

        let gradex = if grade.to_lowercase().contains("first"){
            Grade::First
        }else if grade.to_lowercase().contains("second") {
            Grade::Second
        }else if grade.to_lowercase().contains("third") {
            Grade::Third
        }else {
            Grade::None
        };

        let student = Student::new(id, name.to_string(), age, sex_x, gradex, score);
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
        if self.students.is_empty(){
            println!("Invalid ID");
            return;
        } 

        for i in &self.students{
            if i.id == id {
                println!(" 
                    Student id: {}, 
                    Student name: {},
                    Student age: {},
                    Student grade: {:?},
                    Student score: {},
                ", i.id, i.name, i.age, i.grade, i.score)
            }else {
                println!("Invalid ID")
            }
        }
    }

    pub fn update_name(&mut self, id: u32, new_name: &str) {
        if let Some(index) =  self.students.iter().position(|student| student.id == id) {
            let student =  &mut self.students[index];
            if student.name != new_name {
                student.name = new_name.to_string();
                return;
            }
        }     
    }

    pub fn update_age(&mut self, id: u32, new_age: u32) {
        if let Some(index) = self.students.iter().position(|student| student.id == id) {
            let student = &mut self.students[index];
          
            if student.age != new_age {
                student.age = new_age;
                return;
            }
        }
    }

     pub fn update_score(&mut self, id: u32, new_score: f32) {
        if let Some(index) = self.students.iter().position(|student| student.id == id) {
            let student = &mut self.students[index];
         
            if student.score != new_score {
                student.score = new_score;
                return;
            }
        }
    }

    pub fn update_grade(&mut self, id: u32, input: &str) {
        if let Some(index) = self.students.iter().position(|student| student.id == id ){
            let student = &mut self.students[index];
            if input.to_lowercase().contains("first"){
                student.grade = Grade::First
            }
            if input.to_lowercase().contains("second"){
                student.grade = Grade::Second
            }
            if input.to_lowercase().contains("third"){
                student.grade = Grade::Third
            }
        }
    }

    pub fn delete_student(&mut self, id: u32) {
        if let Some(index) = self.students.iter().position(|student| student.id == id) {
            self.students.remove(index);
        }else {
            
        }
    }
}
