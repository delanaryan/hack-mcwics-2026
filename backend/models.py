# Pydantic models for data validation and serialization
from pydantic import BaseModel
from typing import List, Optional

class Paragraph(BaseModel):
    text: str
    page_number: int

class Book(BaseModel):
    book_id: str
    title: str
    language: str
    paragraphs: List[Paragraph]

class Annotation(BaseModel):
    book_id: str
    paragraph_id: str
    start_char: int
    end_char: int
    annotation_text: str
    source: str 

