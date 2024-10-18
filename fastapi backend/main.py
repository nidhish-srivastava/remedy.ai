from fastapi import FastAPI,APIRouter
from routes.chat_routes import chat_routes
from controllers.user_controller import router as user_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

app.include_router(user_routes,prefix="/api/user",tags=["user"])
app.include_router(chat_routes,prefix="/api/chat",tags=["chats"])