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
const port = process.env.PORT || 8000
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connection SUCCESS')
    }
    catch (error) {
        console.error('MongoDB connection FAIL')
    }
}


app.use("/api/v1/auth",authRoute)
app.use("/api/v1/chat",chatRoute)

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`)
})
