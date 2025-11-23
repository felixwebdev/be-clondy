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

  async getMyImages(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const images = await Image.find({ uploaderId: userId })
    .sort({ createdAt: -1 })
    .select("title url createdAt")
    .lean();
    return images;
  }

  async getFriendsImages(userId) {
    // Import Relationship model here to avoid circular dependency
    const Relationship = (await import("../models/Relationship.js")).default;
    
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    // Get all friends (ACCEPTED relationships)
    const relationships = await Relationship.find({
      $or: [
        { senderId: userId, status: "ACCEPTED" },
        { receiverId: userId, status: "ACCEPTED" }
      ]
    }).lean();

    // Extract friend IDs
    const friendIds = relationships.map(rel => 
      rel.senderId.toString() === userId.toString() 
        ? rel.receiverId 
        : rel.senderId
    );

    if (friendIds.length === 0) {
      return [];
    }

    // Get images from all friends with user info
    const images = await Image.find({ 
      uploaderId: { $in: friendIds } 
    })
    .sort({ createdAt: -1 })
    .populate('uploaderId', 'username avatar')
    .select("title url createdAt uploaderId")
    .lean();

    // Transform to include user info
    return images.map(img => ({
      ...img,
      userName: img.uploaderId?.username || 'Unknown',
      userAvatar: img.uploaderId?.avatar || null,
      uploaderId: img.uploaderId?._id
    }));
  }
}

export default new ImageService();
