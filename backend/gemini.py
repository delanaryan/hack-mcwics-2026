from google import genai
import os
from dotenv import load_dotenv
from pathlib import Path

current_dir = Path(__file__).resolve().parent
env_path = current_dir.parent.parent / ".env"

load_dotenv(dotenv_path=env_path) # Load variables from .env file
api_key = os.getenv("GEMINI_API_KEY")

if api_key is None:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please set it in the .env file.")
else: 
    print("GEMINI_API_KEY successfully loaded from .env file.")

client = genai.Client(api_key=api_key)

def explain_passage(passage: str):
    prompt = f"Explain the following passage in simple terms for a language learner. Please focus on meaning, grammar, spelling, cultural context, and context within the novel.:\n\n{passage}"
    response = client.models.generate_content(model="gemini-2.5-flash-lite", contents=prompt)
    print(response.text)
    return response.text

#explain_passage("In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.")