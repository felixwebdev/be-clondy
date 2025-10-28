import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    userId1: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    userId2: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    lastMessageId: {type: mongoose.Schema.Types.ObjectId, ref: "Message"},
    lastMessageAt: {type: Date, default: Date.now}
})

export default mongoose.model("ChatRoom", chatRoomSchema);