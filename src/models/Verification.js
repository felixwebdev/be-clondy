import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    otp: {type: String, required: true},
    expire: {type: Date, required: true},
    createdAt: { type: Date, default: Date.now, expires: 180}
})

export default mongoose.model("Verification", verificationSchema);