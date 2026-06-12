mod library;
mod member;

use library::Library;
use member::Member;

fn main() {
  let mut library = Library::new();
  let mut member = Member::new("rasputin".to_string());  

    library.add_book("48 laws of power".to_string(), "robert green".to_string(), true);
    library.add_book("meditation".to_string(), "Machiavelli".to_string(), true);
    library.add_book("thing fall apart".to_string(), "Chinua Achebe".to_string(), true);
    library.add_book("romeo an julliet".to_string(), "William Shakespeare".to_string(), false);


    library.list_books();

    println!("\n--- Searching for 'Rust in Action' ---");
    if let Some(book) = library.search_by_title("meditation") {
        println!("Found: {} by {}", book.title, book.author);
    }

    println!("\n--- Searching for books by 'Machiavelli' ---");
    let books = library.search_by_author("Machiavelli");
    for book in books {
        println!("Found: {}", book.title);
    }
    
    println!("\n--- Checkout Process ---");
    library.checkout_book("48 laws of power", &mut member);
    library.checkout_book("meditation", &mut member);
    library.checkout_book("romeo an julliet", &mut member);
       
     member.list_borrowed_books();

    println!("\n--- Book Info ---");
    library.display_book_info("48 laws of power");
    library.display_book_info("romeo an julliet");

    println!("\n--- Return Process ---");
    library.return_book("48 laws of power", &mut member);

    println!("\n--- Updated Library ---");
    library.list_books();


    println!("\n--- rasputins's Remaining Books ---");
    member.list_borrowed_books();
    
}