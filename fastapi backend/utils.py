from jose import  jwt
import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

def generate_token(user):
    return jwt.encode({"id": str(user["_id"]), "role": user.get("role", "user")}, JWT_SECRET, algorithm=ALGORITHM)

def decode_token(access_token):
    return jwt.decode(access_token,JWT_SECRET,algorithms=ALGORITHM)

def serialize_document(doc):
    """Convert MongoDB document fields to JSON serializable format."""
    if doc:
        # Convert ObjectId to string and remove password field if necessary
        doc["_id"] = str(doc["_id"])
        return doc