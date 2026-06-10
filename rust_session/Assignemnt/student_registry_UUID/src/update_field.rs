use crate::grade::{Grade, Sex};
use crate::student_struct::Student;

#[derive(Debug)]
pub enum UpdateField {
    Name(String),
    Age(u8),
    Sex(Sex),
    Grade(Grade),
    Score(f32),
}

impl UpdateField {
    // This function describes the fields being changed (Useful for logging/feedback)
    pub fn label(&self) -> &str {
        match self {
            UpdateField::Name(_) => "name",
            UpdateField::Age(_) => "age",
            UpdateField::Sex(_) => "gender",
            UpdateField::Grade(_) => "grade",
            UpdateField::Score(_) => "score",
        }
    }

    // This function applies the changes directly onto a student.
    // What this function does is: I have a package... I want to change a value in that package.
    // apply() unwraps the package and write the new value unto the student.
    pub fn apply(&self, student: &mut Student) {
        match self {
            // takes the value i'm carrying and writes it onto student.
            UpdateField::Name(val) => student.name = val.clone(),
            UpdateField::Age(val) => student.age = *val,
            UpdateField::Sex(val) => student.sex = val.clone(),
            UpdateField::Grade(val) => student.grade = val.clone(),
            UpdateField::Score(val) => student.score = *val,
        }
    }
}
