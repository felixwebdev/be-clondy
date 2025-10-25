import mongoose from "mongoose";

const relationSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.ObjectId, required: true, ref: "User"},
    receiverId: {type: mongoose.Schema.ObjectId, required: true, ref: "User"},
    status: {type: String, enum: ["waiting", "accepted", "canceled"], default: "waiting"},
}, {timestamps: true});

export default mongoose.model("Relationship", relationSchema);