# API File
from fastapi import FastAPI
from routes.books import router as books_router
from routes.annotations import router as annotations_router
from routes.ai import router as ai_router

app = FastAPI(title="Public Books API")

app.include_router(books_router, prefix="/api/books")
app.include_router(annotations_router, prefix="/api/annotations")
app.include_router(ai_router, prefix="/api/ai")