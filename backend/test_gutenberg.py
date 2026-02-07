import gutenbergpy.textget

def get_book_text(book_id: int):
    """
    Fetches a public domain book by Gutenberg ID and returns plain text.
    """
    # Download the book (cached locally automatically)

    raw_book = gutenbergpy.textget.get_text_by_id(2701) # with headers
    clean_book = gutenbergpy.textget.strip_headers(raw_book) # without headers
    return clean_book

def main():
    print("=== Gutenberg API Test ===")
    book_id = input("Enter a Gutenberg book ID (e.g., 1342 for Moby Dick): ")
    
    try:
        book_id = int(book_id)
        text = get_book_text(book_id)
        print(f"\nFirst 10000 characters of book {book_id}:\n")
        print(text[:10000])  # print first 10000 characters
    except Exception as e:
        print("Error fetching book:", e)

if __name__ == "__main__":
    main()
