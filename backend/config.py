# Loads environment variables from a .env file

import os
from dotenv import load_dotenv

load_dotenv() # Load variables from .env file

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
