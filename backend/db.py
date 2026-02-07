# Connect to MongoDB and provide a database client

from pymongo import MongoClient
from .config import MONGO_URI, DB_NAME
import os

client = MongoClient(MONGO_URI)
db = client[f"{DB_NAME}"]

books_collection = db["books"]
annotations_collection = db["annotations"]
