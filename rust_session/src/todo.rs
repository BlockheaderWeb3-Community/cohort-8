#[derive(Debug, PartialEq)]
#[allow(dead_code)]
pub enum Status {
  Pending,
  Ongoing,
  Completed,
  Cancel,
}

#[derive(Debug)]
#[allow(dead_code)]
pub  struct Todo {
  id: u8,
  title: String,
  description: String,
  status: Status,
}

impl Todo {
  pub fn create_todo(id: u8, title: String, description: String, status: Status) -> Todo {
    let todo: Todo = Todo { 
      id, 
      title, 
      description, 
      status 
    };
    println!("You have created a new todo");
    return todo;
  }

  pub fn add_todo(current_id: u8, title: String, description: String, status: Status) -> Todo {
    let new_id: u8 = current_id + 1;
    let todo: Todo = Todo { 
      id: new_id, 
      title, 
      description,
      status
    };
    println!("You have added a new todo with ID: {}", new_id);
    return  todo;
  }
}
