use crate::member::Member;

#[derive(Debug, Clone)]
pub struct Book {
    pub title: String,
    pub author: String,
    pub available: bool,
}

#[derive(Debug)]
pub struct Library {
    pub books: Vec<Book>,
}

impl Library {
    pub fn new() -> Self {
        Library { books: Vec::new() }
    }


    pub fn add_book(&mut self, title: String, author: String, available: bool) {
        let new_book = Book {
            title,
            author,
            available,
        };
        self.books.push(new_book);
        println!("✅ Book added successfully!");
    }


    pub fn list_books(&self) {
        if self.books.is_empty() {
            println!("📚 No books in the library yet!");
            return;
        }
        
        println!("\n📚 Library Collection:");
        println!("{:<30} {:<25} {:<10}", "Title", "Author", "Available");
        println!("{}", "-".repeat(65));
        
        for book in &self.books {
            println!(
                "{:<30} {:<25} {:<10}",
                book.title,
                book.author,
                if book.available { "Yes" } else { "No" }
            );
        }
    }

    pub fn search_by_title(&self, title: &str) -> Option<&Book> {
        self.books.iter().find(|book| book.title == title)
    }

    
    pub fn search_by_author(&self, author: &str) -> Vec<&Book> {
        self.books.iter().filter(|book| book.author == author).collect()
    }

    
    pub fn checkout_book(&mut self, title: &str, member: &mut Member) -> bool {
        if let Some(book) = self.books.iter_mut().find(|book| book.title == title) {
            if book.available {
                book.available = false;
                member.borrowed_books.push(book.title.clone());
                println!("✅ '{}' has been checked out by {}", title, member.name);
                return true;
            } else {
                println!("❌ '{}' is already checked out!", title);
                return false;
            }
        }
        println!("❌ Book '{}' not found!", title);
        false
    }

    
    pub fn return_book(&mut self, title: &str, member: &mut Member) -> bool {
        if let Some(book) = self.books.iter_mut().find(|book| book.title == title) {
            if !book.available {
                book.available = true;
                member.borrowed_books.retain(|b| b != title);
                println!("✅ '{}' has been returned by {}", title, member.name);
                return true;
            } else {
                println!("❌ '{}' wasn't checked out!", title);
                return false;
            }
        }
        println!("❌ Book '{}' not found!", title);
        false
    }

    
    pub fn display_book_info(&self, title: &str) {
        if let Some(book) = self.search_by_title(title) {
            println!("\n📖 Book Details:");
            println!("  Title:     {}", book.title);
            println!("  Author:    {}", book.author);
            println!("  Status:    {}", if book.available { "Available" } else { "Checked Out" });
        } else {
            println!("❌ Book '{}' not found!", title);
        }
    }
}