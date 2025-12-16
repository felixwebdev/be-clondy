import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Image from "../models/Image.js";
import User from "../models/User.js";
import Relationship from "../models/Relationship.js";
import AppError from "../utils/AppError.js";
import RELATION from "../config/relation_Status.js";

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
      .select("title url createdAt uploaderId")
      .lean();
    return images;
  }

  async getFriendsImages(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    // Get all friends (ACCEPTED relationships)
    const relationships = await Relationship.find({
      $or: [
        { senderId: userId, status: RELATION.ACCEPTED },
        { receiverId: userId, status: RELATION.ACCEPTED },
      ],
    }).lean();

    // Extract friend IDs
    const friendIds = relationships.map((rel) =>
      rel.senderId == userId ? rel.receiverId : rel.senderId
    );

    if (friendIds.length === 0) {
      return [];
    }

    // Only keep friends whose accounts are verified
    const verifiedFriends = await User.find({
      _id: { $in: friendIds },
      isVerified: true,
    })
      .select("_id username avatar")
      .lean();

    if (!verifiedFriends || verifiedFriends.length === 0) {
      return [];
    }

    const verifiedIds = verifiedFriends.map((u) => u._id);

    // Get images from verified friends with user info
    const images = await Image.find({
      uploaderId: { $in: verifiedIds },
    })
      .sort({ createdAt: -1 })
      .populate("uploaderId", "username avatar")
      .select("title url createdAt uploaderId")
      .lean();

    // Transform to include user info
    return images.map((img) => ({
      ...img,
      userName: img.uploaderId?.username || "Unknown",
      userAvatar: img.uploaderId?.avatar || null,
      uploaderId: img.uploaderId?._id,
    }));
  }

  async deleteImageFromCloudinary(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      throw new AppError("Failed to delete image from Cloudinary", 500);
    }
  }

  async deleteImage(userId, imageId) {
    const image = await Image.findById(imageId);

    if (!image) {
      throw new AppError("Image not found", 404);
    }

    if (image.uploaderId.toString() !== userId.toString()) {
      throw new AppError("Unauthorized to delete this image", 403);
    }

    await this.deleteImageFromCloudinary(image.publicId);

    await Image.findByIdAndDelete(imageId);

    return "Image deleted successfully";
  }
}

export default new ImageService();
