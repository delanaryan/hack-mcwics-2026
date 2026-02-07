from fastapi import APIRouter
from backend.gemini import explain_passage

router = APIRouter()

@router.post("/explain")
def explain(payload: dict):
    text = payload["text"]
    if not text:
        return {"error": "Text is required"}
    explanation = explain_passage(text)
    return {"explanation": explanation}
