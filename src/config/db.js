import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async() =>{
    const MGDB_URI = process.env.MOGODB_URI;
    try {
        await mongoose.connect(MGDB_URI);
        console.log("You successfully connected to MongoDB!");
    }
    catch (err) {
        console.log("Cannot connect to db: ", err);
        process.exit(1);
    }
}