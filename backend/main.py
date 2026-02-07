# API File
from fastapi import FastAPI
from backend.routes.books import router as books_router
from backend.routes.annotations import router as annotations_router
from backend.routes.ai import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.books import router as books_router
from backend.gutenberg import save_books_to_db
app = FastAPI()

app.include_router(books_router)

@app.on_event("startup")
def startup_event():
    from backend.db import books_collection
    if books_collection.count_documents({}) == 0:  # Only load books if the collection is empty
        save_books_to_db(language="en", limit=10)  # Load 10 English books on startup for testing
        save_books_to_db(language="ru", limit=10)  # Load 10 Russian books on startup for testing
        save_books_to_db(language="zh", limit=10)  # Load 10 Chinese books on startup for testing
        save_books_to_db(language="es", limit=10)  # Load 10 Spanish books on startup for testing
        save_books_to_db(language="fr", limit=10)  # Load 10 French books on startup for testing

#CORS to allow frontend to access backend from different origin during development. In production, this should be configured more securely to only allow the frontend origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running"}

app.include_router(books_router, prefix="/api/books")
app.include_router(annotations_router, prefix="/api/annotations")
app.include_router(ai_router, prefix="/api/ai")