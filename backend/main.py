# API File
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.routes.books import router as books_router
from backend.routes.annotations import router as annotations_router
from backend.routes.ai import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
from backend.gutenberg import save_books_to_db
import os

app = FastAPI()

# Serve static files from the reader directory
reader_dir = os.path.join(os.path.dirname(__file__), "..", "reader")
if os.path.exists(reader_dir):
    app.mount("/", StaticFiles(directory=reader_dir, html=True), name="static")

@app.on_event("startup")
def startup_event():
    from backend.db import books_collection
    if books_collection.count_documents({}) == 0:  # Only load books if the collection is empty
        save_books_to_db(language="en", limit=10)  # Load 10 English books on startup for testing
        save_books_to_db(language="ru", limit=10)  # Load 10 Russian books on startup for testing
        save_books_to_db(language="zh", limit=10)  # Load 10 Chinese books on startup for testing
        save_books_to_db(language="es", limit=10)  # Load 10 Spanish books on startup for testing
        save_books_to_db(language="fr", limit=10)  # Load 10 French books on startup for testing

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/")
def root():
    return {"message": "Backend API is running"}

app.include_router(books_router, prefix="/api/books")
app.include_router(annotations_router, prefix="/api/annotations")
app.include_router(ai_router, prefix="/api/ai")