from fastapi import APIRouter, HTTPException,Response,Request, status,Cookie, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from bson import ObjectId
from configurations import users_collection
from database.schemas import UserRegister,UserLogin
from utils import generate_token,decode_token,serialize_document
from jose import JWTError

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register")
async def register(user: UserRegister):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User with email already exists")

    hashed_password = pwd_context.hash(user.password)
    user_dict = dict(user)
    user_dict["password"] = hashed_password

    result = users_collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    return {
        "status" : 200,
        "data" : None,
        "message" : "User account created"
    }


@router.post("/login")
async def login(response : Response,user : UserLogin) : 
    db_user = users_collection.find_one({"email" : user.email})
    if not db_user : 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User doesn't exist")
    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    
    access_token = generate_token(db_user)
    response.set_cookie("access_token",access_token,httponly=True,secure=True,samesite='none')
    return {
        "status" : 200,
        "data" : None,
        "message" : "User logged in successfully"
    }

async def verify_jwt_token(request: Request):
    # Extract token from the request cookies
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized request")
    
    try:
        payload = decode_token(token)
        user_id = payload.get("id")
        
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized request")
        
        user = users_collection.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")
        
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")


@router.post("/logout")
async def logout(response: Response, current_user: dict = Depends(verify_jwt_token)):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite='none',
    )
    return {"message": "User logged out successfully"}

@router.get("/current-user")
async def get_current_user(current_user: dict = Depends(verify_jwt_token)):
    return {
        "status": 200,
        "data": serialize_document(current_user),  # current_user is populated by the middleware
        "message": "User fetched successfully"
    }