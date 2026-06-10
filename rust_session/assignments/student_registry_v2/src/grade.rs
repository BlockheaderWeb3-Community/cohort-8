#[derive(Debug, PartialEq)]
pub enum Grade {
    First,
    Second,
    Third,
    None
}

impl Grade {
    pub fn as_str(&self) -> &str {
        match self {
            Grade::First => "Cohort 1",
            Grade::Second => "Cohort 2",
            Grade::Third => "Cohort 3",
            Grade::None => "None"
        }
    }
}

#[derive(Debug)]
pub enum Sex {
    Male,
    Female,
    None
}

impl Sex {
    pub fn to_str(&self) {
        match self {
            Sex::Male => println!("male: 👨🏾"),
            Sex::Female => println!("female: 👧🏾"),
            Sex::None => println!("None")
        }
    }
}
