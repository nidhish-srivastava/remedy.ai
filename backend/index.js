import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js"
import chatRoute from "./routes/chat.route.js"
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    // origin: "https://remedy-nmithacks-frontend.vercel.app",
    origin: "http://localhost:5173",
    credentials: true
}))



const PORT = process.env.PORT || 8000

const start = async () => {
    mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to DB");
    app.listen(PORT, () => {
        console.log(`Server listening at port ${PORT}`);
    })
}
start()

app.get('/',async(req,res)=>{
    res.send(`Welcome to Backend deployment of remedy`)
})

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/chat",chatRoute)