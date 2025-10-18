import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Image from "../models/Image.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

class ImageService {
  async uploadImage(uploaderId, filePath, title = "") {
    try {
      if (!filePath || !uploaderId)
        throw new AppError("All fields are required", 400);

      //Upload image from tmp to Cloundinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "clondy_api",
      });

      //Delete tmp file after upload success
      fs.unlinkSync(filePath);

      //Save image to db
      const image = await Image.create({
        publicId: result.public_id,
        uploaderId,
        title,
        url: result.secure_url,
      });

      await User.findByIdAndUpdate(uploaderId, {
        $push: { imageList: image._id },
      });

      return {
        uploaderId,
        publicId: result.public_id,
        title,
        url: result.secure_url,
      };
    } catch (err) {
      throw new AppError(err);
    }
  }
}

export default new ImageService();
