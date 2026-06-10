#[derive(Debug)] // It can be called a macro, attribute or annotation
pub enum AgeGroup {
  Juvenile,
  Silver,
  Golden,
  Platinum,
  Centurion,
}

impl AgeGroup {
  pub fn from_age(age: u32) -> AgeGroup {
    match age {
      0..=17 =>  {
        println!("Go back home!");
        AgeGroup::Juvenile
      }
      18..=25 => {
        println!("You're above the age of 18");
        AgeGroup::Silver 
      }
      26..=50 => {
        println!("You're above the age of 25.");
        AgeGroup::Golden
      }
      51..=75 => {
        println!("You're above the age of 50.");
        AgeGroup::Platinum
      }
      _ => {
        println!("You're above the age of 75 now.");
        AgeGroup::Centurion
      }

    }
  }
}


#[derive(Debug)]
pub enum VoterEligibility {
  Eligible,
  NotEligible,
}

#[allow(dead_code)]
impl VoterEligibility {
  pub fn is_eligible(group: &AgeGroup) -> VoterEligibility {
    match group {
      AgeGroup::Juvenile => VoterEligibility::NotEligible,
      _ => VoterEligibility::Eligible,
    }
  }

  pub fn description(&self) -> &str {
    match self {
        VoterEligibility::Eligible => "This voter is eligible.",
        VoterEligibility::NotEligible => "You're not eligible to VOTE!",
    }
}
}

pub fn check_voter_eligibility(age: u32) {
  let age_group = AgeGroup::from_age(age);
  println!("You're in the age group of {:?}", age_group);
}
