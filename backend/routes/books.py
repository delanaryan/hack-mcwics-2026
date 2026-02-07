from fastapi import APIRouter
from backend.db import books_collection

router = APIRouter()

@router.get("/")
def list_books():
    return list(books_collection.find({}, {"_id": 0})) # Return all books without the MongoDB _id field

@router.get("/{book_id}")
def get_book(book_id: str):
    book = books_collection.find_one({"book_id": book_id}, {"_id": 0})
    if book:
        return book
    return {"error": "Book not found"}