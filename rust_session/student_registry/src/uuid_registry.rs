use crate::grade::{Grade, Sex};
use uuid::Uuid;

#[derive(Debug)]
pub struct UuidStudent {
    pub id: Uuid,
    pub name: String,
    pub age: u8,
    pub sex: Sex,
    pub grade: Grade,
    pub score: f32,
}

impl UuidStudent {


                pub fn new(name: String, age: u8, sex: Sex, grade: Grade, score: f32) -> Self {
                    Self {
                        id: Uuid::new_v4(),
                        name,
                        age,
                        sex,
                        grade,
                        score,
                    }
                }
            }

            pub struct UuidRegistry {
                pub students: Vec<UuidStudent>,
            }

            impl UuidRegistry {
                pub fn new() -> Self {
                    Self {
                        students: Vec::new(),
                    }
                }

                pub fn add(&mut self, name: &str, age: u8, sex: Sex, grade: Grade, score: f32) -> Uuid {
                    let student = UuidStudent::new(name.to_string(), age, sex, grade, score);
                    let id = student.id;
                    println!("Added: {} (ID {})", student.name, student.id);
                    self.students.push(student);
                    id
                }

                pub fn update(&mut self,id: Uuid,name: &str,age: u8,sex: Sex,grade: Grade,score: f32,) -> bool {
                    if let Some(student) = self.students.iter_mut().find(|student| student.id == id) {
                        student.name = name.to_string();
                        student.age = age;
                        student.sex = sex;
                        student.grade = grade;
                        student.score = score;
                        println!("Updated: {} (ID {})", student.name, student.id);
                        true
                    } else {
                        println!("No student found with ID: {}", id);
                        false
                    }
                }

                pub fn find_by_id(&self, id: Uuid) -> Option<&UuidStudent> {
                    self.students.iter().find(|student| student.id == id)
                }


                
}
