import mongoose from "mongoose";
import { AREA } from "../config/area.js";

const areaSchema = new mongoose.Schema({
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "User" 
    },
    areaManagement: [{
        type: String,
        enum: Object.values(AREA),
        required: true
    }]
}, { timestamps: true });

export default mongoose.model("Area", areaSchema);
