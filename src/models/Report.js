import mongoose from "mongoose";
import REPORT_TYPE from "../config/report_Type.js";

const reportSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    title: {type: String},
    content: {type: String},
    type: {type: String, enum: [REPORT_TYPE.SUGGESTION, REPORT_TYPE.REPORT], default: REPORT_TYPE.REPORT},
}, {timestamps: true});

export default mongoose.model("Report", reportSchema);