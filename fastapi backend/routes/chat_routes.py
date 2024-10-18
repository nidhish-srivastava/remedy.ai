from fastapi import APIRouter, HTTPException
from controllers.chat_controller import create_new_chat, update_chat,fetch_all_chats,fetch_chat
from typing import List
from database.schemas import Chat,Message
router = APIRouter()

@router.post("/")  
async def create_chat(chat: Chat):  
    return await create_new_chat(chat)

@router.get("/{user_id}") 
async def get_all_chats(user_id: str):  
    try:
        chats = await fetch_all_chats(user_id) 
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.patch("/{chat_id}")  
async def update_chat_route(chat_id: str, messages: List[Message]):  
    return await update_chat(chat_id, messages)

@router.get("/single_chat/{chat_id}") 
async def get_single_chat(chat_id: str): 
    return await fetch_chat(chat_id)

chat_routes = router