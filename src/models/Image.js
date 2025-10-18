import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    publicId: {type: String, required: true, unique: true},
    uploaderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String, trim: true},
    url: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("Image", imageSchema);