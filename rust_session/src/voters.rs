#[derive(Debug)]
pub enum Age {
    SilverJubilee,
    GoldenJubilee,
    PlatinumJubilee,
    Centenarian
}

impl Age {
    pub fn get_age(&self) -> &str {
        match self {
            Age::SilverJubilee => "25 years",
            Age::GoldenJubilee => "50 years",
            Age::PlatinumJubilee => "75 years",
            Age::Centenarian => "100 years",
        }
    }
}

#[derive(Debug)]
pub enum EligibleVoters {
    Juvenile,
    Teenager,
    Adult
}

impl EligibleVoters {
    pub fn get_eligible_voters(&self) -> &str {
        match self {
            EligibleVoters::Juvenile => "17 years and below",
            EligibleVoters::Teenager => "18 years and above",
            EligibleVoters::Adult => "35 years and above",
        }
    }
}