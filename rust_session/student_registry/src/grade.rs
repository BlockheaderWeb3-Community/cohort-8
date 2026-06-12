#[derive(Debug, PartialEq)]
pub enum Grade {
    First,
    Second,
    Third,
}

impl Grade {
    pub fn as_str(&self) -> &str {
        match self {
            Grade::First => "Cohort 1",
            Grade::Second => "Cohort 2",
            Grade::Third => "Cohort 3",
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum Sex {
    Male,
    Female,
}

impl Sex {
    pub fn to_str(&self) {
        match self {
            Sex::Male => println!("male: 👨🏾"),
            Sex::Female => println!("female: 👧🏾"),
        }
    }
}
