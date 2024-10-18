

def user_helper(user) -> dict:
    return{
        "id" : str(user["_id"]),
        "email" : user["email"],
        "password" : user["password"],
        "name" : user["name"],
        "photo" : user["photo"],
        "gender" : user["gender"],
        "occupation" : user["occupation"],
         "age": user["age"]
    }

def message_helper(message) -> dict:
    return {
        "sender": message["sender"],
        "text": message.get("text"),
        "image": message.get("image"),
        "created_at": message.get("created_at"),
        "updated_at": message.get("updated_at"),
    }

def chat_helper(chat) -> dict:
    return {
        "userId": str(chat["userId"]),
        "messages": [message_helper(msg) for msg in chat["messages"]],
        "service": chat.get("service"),
        "created_at": chat.get("created_at"),
        "updated_at": chat.get("updated_at"),
    }