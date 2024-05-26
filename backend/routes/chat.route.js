import express from "express"
import { createNewChat, fetchAllChats, fetchChat, updateChat } from "../controllers/chat.controller.js"
const router = express.Router()

router.get("/:userId",fetchAllChats)
router.post("/",createNewChat)
router.patch("/:chatId",updateChat)
router.get("/singleChat/:chatId",fetchChat)

export default router