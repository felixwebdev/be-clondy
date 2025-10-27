import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
   chatRoomId: {type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true},
   senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
   content: {type: mongoose.Schema.Types.ObjectId},
   sendAt: {type: Date, default: Date.now}
});

export default mongoose.model("Message", messageSchema);