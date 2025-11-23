import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    userId1: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    userId2: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    lastMessageId: {type: mongoose.Schema.Types.ObjectId, ref: "Message"},
    lastSenderId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    lastMessage: {type: String},
    lastMessageAt: {type: Date, default: Date.now}
})

// Ensure userId1 is always smaller than userId2 for consistency
chatRoomSchema.pre('save', function(next) {
    if (this.isNew) {
        const id1 = this.userId1.toString();
        const id2 = this.userId2.toString();
        if (id1 > id2) {
            // Swap to ensure userId1 < userId2
            const temp = this.userId1;
            this.userId1 = this.userId2;
            this.userId2 = temp;
        }
    }
    next();
});

// Create compound unique index to prevent duplicate chat rooms
chatRoomSchema.index({ userId1: 1, userId2: 1 }, { unique: true });

export default mongoose.model("ChatRoom", chatRoomSchema);