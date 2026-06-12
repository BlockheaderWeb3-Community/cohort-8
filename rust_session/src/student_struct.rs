#[derive(Debug)]
pub enum Status{
    Pending,
    Completed,
    InProgress,
    Cancelled,
}

impl Status {
    pub fn get_status(&self) -> &str {
        match self {
            Status::Pending => "Pending",
            Status::Completed => "Completed",
            Status::InProgress => "InProgress",
            Status::Cancelled => "Cancelled",
        }
    }
}


pub struct Todo {
    pub id: u8,
    pub title: String,
    pub description: String,
    pub status: Status,
}

impl Todo {
    pub fn new(id: u8, title: String, description: String, status: Status) -> Todo {
        Todo { 
            id, 
            title, 
            description, 
            status 
        }
    }
}