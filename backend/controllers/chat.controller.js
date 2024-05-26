import { ChatModel } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNewChat = asyncHandler(async (req, res) => {
    const { messages, userId } = req.body
    const response = await ChatModel.create({ messages, userId })
    return res.json(new ApiResponse(201, response, "Created new chat successfully"))
}
)

const updateChat = asyncHandler(async (req, res) => {
    const {chatId} = req.params
    const {messages} = req.body
    const response = await ChatModel.updateOne({_id : chatId},{messages : messages})
    if(response?.modifiedCount>0){
        console.log(true);
        return res.status(201).json(new ApiResponse(201,null,"Chat updated successfully"))
    }
})

const fetchAllChats = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const response = await ChatModel.find({ userId }).sort({ updatedAt: -1 })
    return res.status(200).json(new ApiResponse(200, response, "Fetched all chats of user successfully"))
})

const fetchChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    const response = await ChatModel.findById(chatId)
    return res.status(200).json(new ApiResponse(200, response, "Fetched chat successfully"))
})

export { createNewChat, updateChat, fetchAllChats, fetchChat }