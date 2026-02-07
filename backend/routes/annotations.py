from fastapi import APIRouter
from backend.db import annotations_collection

router = APIRouter()

@router.get("/")
def list_annotations():
    return list(annotations_collection.find({}, {"_id": 0})) # Return all annotations without the MongoDB _id field

@router.post("/")
def create_annotation(annotation: dict):
    annotations_collection.insert_one(annotation)
    return {"message": "Annotation created successfully"}