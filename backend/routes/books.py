from fastapi import APIRouter
from backend.db import books_collection
from backend.gutenberg import fetch_books_from_gutenberg, save_books_to_db
import requests

#router = APIRouter()
router = APIRouter(tags=["books"])

@router.get("/")
def list_books():
    return list(books_collection.find({}, {"_id": 0}))

@router.post("/load")
def load_books(language: str = "en", limit: int = 10):
    count = save_books_to_db(language=language, limit=limit)
    return {
        "message": f"Saved {count} books to the database",
        "language": language
    }

@router.post("/seed")
def seed_books(language: str = "en", limit: int = 10):
    inserted = save_books_to_db(language=language, limit=limit)
    return {
        "message": "Books seeded",
        "inserted": inserted
    }

@router.get("/{book_id}")
def get_book(book_id: str):
    book = books_collection.find_one({"book_id": book_id}, {"_id": 0})
    if book:
        return book
    return {"error": "Book not found"}

@router.get("/{book_id}/text")
async def get_book_text(book_id: str):
    """Fetch book text from Gutenberg URL (CORS proxy)"""
    from fastapi.responses import PlainTextResponse
    
    book = books_collection.find_one({"book_id": book_id}, {"_id": 0})
    if not book or not book.get("text_url"):
        return {"error": "Book or text URL not found"}
    
    try:
        res = requests.get(book["text_url"])
        res.raise_for_status()
        return PlainTextResponse(res.text)
    except requests.RequestException as e:
        return {"error": str(e)}