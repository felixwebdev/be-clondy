import mongoose from "mongoose";
import RELATION from "../config/relation_Status.js";

const relationSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.ObjectId, required: true, ref: "User"},
    receiverId: {type: mongoose.Schema.ObjectId, required: true, ref: "User"},
    status: {type: String, enum: [RELATION.WAITING, RELATION.ACCEPTED, RELATION.CANCELED], default: RELATION.WAITING},
}, {timestamps: true});

export default mongoose.model("Relationship", relationSchema);