import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender : {type : String,enum : ['user','bot'],required:true},
    text : {type : String,required:true}
},{
    timestamps : true
})

const ChatSchema = new mongoose.Schema({
    userId : {type : Schema.Types.ObjectId,ref : 'User',required:true},
    messages : [MessageSchema]
},{
    timestamps : true
})

const MessageModel = mongoose.model('Message',MessageSchema)
const ChatModel = mongoose.model('Chat',ChatSchema)

export {MessageModel,ChatModel}