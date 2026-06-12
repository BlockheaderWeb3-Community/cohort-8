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

#[derive(Debug)]
pub enum Sex {
    Male,
    Female,
}

impl Sex {
    pub fn to_str(&self) -> &str {
        match self {
            Sex::Male => "male",
            Sex::Female => "female",
        }
    }
}
