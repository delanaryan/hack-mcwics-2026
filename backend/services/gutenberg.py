import requests 

GUTENDEX_URL = "https://gutendex.com/books"

def fetch_books_from_gutenberg(language="en", limit=1):
    res = requests.get(GUTENDEX_URL, params={"languages": language, "page_size": limit})
    if res.status_code == 200:
        return res.json().get("results", [])
    return []

def fetch_book_text(text_url):
    res = requests.get(text_url)
    if res.status_code == 200:
        return res.text
    return ""