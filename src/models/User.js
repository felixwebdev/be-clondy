import mongoose from "mongoose";
import ROLE_LISTS from "../config/role_List.js";

const friendRequestSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
     status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    sentAt: { type: Date, default: Date.now }
})

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, default: "https://res.cloudinary.com/desoarfu8/image/upload/v1759995051/images_ixruc3.png"},
    role: {type: String, enum: [ROLE_LISTS.ADMIN, ROLE_LISTS.USER], default: ROLE_LISTS.USER},
    location: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    friends: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    friendRequests: [friendRequestSchema],
    imageList: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Image"},
    ],
    chatRooms: [
        {type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom"},
    ],
}, { timestamps: true,});


export default mongoose.model("User", userSchema);
