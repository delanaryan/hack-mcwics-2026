import requests 
import random 

GUTENDEX_URL = "https://gutendex.com/books"

def fetch_books_from_gutenberg(language="en", limit=10):
    try:
        res = requests.get(GUTENDEX_URL, params={"languages": language, "page_size": limit})
        res.raise_for_status()
        return res.json().get("results",[]) # Return books as json file
    except requests.RequestException as e:
        print("Error Fetching Books:", e)
        return []
    
def fetch_book_text(text_url):
    try: 
        res = requests.get(text_url)
        res.raise_for_status()

        text = res.text

        start_token = "*** START OF THE PROJECT GUTENBERG EBOOK"
        if start_token in text:
            text = text.split(start_token, 1)[1]

        end_token = "*** END OF THE PROJECT GUTENBERG EBOOK"
        if end_token in text:
            text = text.split(end_token, 1)[0]

        return text.strip()
    
    except requests.RequestException as e:
        print("Error Fetching Book Text:", e)
        return ""
    
#--- For Testing ---#
def get_random_paragraph(language="en"):
    books = fetch_books_from_gutenberg(language=language, limit=20)

    if not books:
        return None, None
    
    random.shuffle(books)

    for book in books:
        text_url = book["formats"].get("text/plain; charset=utf-8") or book["formats"].get("text/plain")
        if text_url:
            text = fetch_book_text(text_url)
            if text:
                paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 100]

                if paragraphs:
                    selected_paragraph = random.choice(paragraphs)
                    return selected_paragraph, book["title"]
    return None, None

if __name__ == "__main__":
    lang = input("Enter language code (e.g., en, ru, de, fr): ").strip().lower()
    paragraph, title = get_random_paragraph(language=lang)
    if paragraph:
        print(f"\nBook: {title}\n")
        print(f"Random paragraph:\n{paragraph}")
    else:
        print(f"No books found for language '{lang}' or unable to fetch paragraph.")