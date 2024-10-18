from configurations import chats_collection
from database.schemas import Chat,Message
from bson import ObjectId
from typing import List
from fastapi import HTTPException,status
from datetime import datetime
from database.models import chat_helper
from utils import serialize_document
from fastapi.encoders import jsonable_encoder

async def create_new_chat(chat: Chat):

    chat.created_at = datetime.now()
    chat.updated_at = datetime.now()
    try:
        message_dict = [dict(message) for message in chat.messages]
        chat_dict = {
        "userId": chat.userId,
        "messages": message_dict,
        "service": chat.service,
        "created_at" : chat.created_at,
        "updated_at" : chat.updated_at
       }
        resp =  chats_collection.insert_one(chat_dict)
        return {"status_code" : 200,"data" : str(resp.inserted_id),"message" : "New chat created successfully"}
    except Exception as e:
        print(f"Error creating chat: {e}")  # Log the error
        raise HTTPException(status_code=500, detail="An error occurred while creating the chat.")

async def update_chat(chat_id: str, messages: List[Message]) -> dict:
    messages_dict = [jsonable_encoder(message) for message in messages]
    result = chats_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {"messages": messages_dict}}
    )
    if result.modified_count > 0:
        return {
            "status_code": 201,
            "data": None,
            "message": "Chat updated successfully"
        }
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found or no changes made.")

async def fetch_all_chats(user_id: str) -> dict:
    chats = chats_collection.find({"userId": user_id}).sort("updated_at", -1).to_list(length=None)
    chats_with_id = [serialize_document(chat) for chat in chats]
    return {
        "status_code" : 200,
        "data" : chats_with_id,
        "message" : "Fetched chats successfully"
    }

async def fetch_chat(chat_id: str) -> dict:
    chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found.")

    chat["_id"] = str(chat["_id"]) 
    
    return {
        "status_code": 200,
        "data": chat,  
        "message": "Fetched chat successfully"
    }

