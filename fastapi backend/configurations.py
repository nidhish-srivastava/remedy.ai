from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB URI
uri = os.getenv("MONGODB_URI")
if uri is None:
    raise ValueError("MongoDB URI not found in environment variables.")

# Initialize MongoDB Client with error handling
try:
    client = MongoClient(uri, server_api=ServerApi('1'))
except Exception as e:
    raise ConnectionError(f"Could not connect to MongoDB: {e}")

# Defining the database
db = client["remedy"]

# Defining the collections
users_collection = db.get_collection("users")
messages_collection = db.get_collection("messages")
chats_collection = db.get_collection("chats")  # Use get_collection for consistency

# Optionally, you could print a success message or log it
print("Connected to MongoDB and selected database and collections.")
