import mongoose from "mongoose";
import RELATION from "../config/relation_Status.js";

const relationSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    receiverId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    status: {type: String, enum: [RELATION.PENDING, RELATION.ACCEPTED, RELATION.CANCELED], default: RELATION.PENDING},
}, {timestamps: true});

export default mongoose.model("Relationship", relationSchema);