from pydantic import BaseModel,EmailStr
from datetime import datetime
from typing import List,Optional
from enum import Enum

class Message(BaseModel):
    sender : str
    text : Optional[str] = None
    image : Optional[str] = None
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None

class Chat(BaseModel):
    userId : str
    messages : List[Message]
    service : str       
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None    

class Gender(str,Enum):
    male = "Male"
    female = "Female"
    other = "Other"

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    photo: Optional[str] = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    gender: Gender
    occupation: str
    age: int    

class UserLogin(BaseModel):
    email : EmailStr
    password : str
