#[derive(Debug)]
pub struct Member {
    pub name: String,
    pub borrowed_books: Vec<String>,
}

impl Member {
    pub fn new(name: String) -> Self {
        Member {
            name,
            borrowed_books: Vec::new(),
        }
    }

    pub fn list_borrowed_books(&self) {
        if self.borrowed_books.is_empty() {
            println!("{} hasn't borrowed any books.", self.name);
        } else {
            println!("\n {}'s Borrowed Books:", self.name);
            for book in &self.borrowed_books {
                println!("  - {}", book);
            }
        }
    }
}