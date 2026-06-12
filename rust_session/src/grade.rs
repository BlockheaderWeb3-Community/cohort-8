#[derive(Debug)]
pub enum Grade {
    First,
    Second,
    Third
}

impl Grade {
    pub fn get_grade_points(&self) -> &str {
        match self {
            Grade::First => "Cohort 1",
            Grade::Second => "Cohort 2",
            Grade::Third => "Cohort 3",
        }
    }
}

#[derive(Debug)]
pub enum Sex {
    Male,
    Female
}

impl Sex {
    pub fn get_sex(&self) {
        match self {
            Sex::Male => println!("Male"),
            Sex::Female => println!("Female"),
        }
    }
}