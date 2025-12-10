// services/UserService.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import VerificationService from "./VerificationService.js";
import AppError from "../utils/AppError.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import ImageService from "./ImageService.js";
import ApiResponse from "../utils/ApiResponse.js";
import Report from "../models/Report.js";
import ROLE_LISTS from "../config/role_List.js";
import { AREA, AREA_BY_REGION } from "../config/area.js";
import Area from "../models/Area.js";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "1d";

class UserService {
  // ---------------- REGISTER ----------------
  async register({ email, username, password, location }) {
    try {
      if (!email || !username || !password || !location) {
        throw new AppError("All fields are required", 400);
      }

      if (password.length < 8) {
        throw new AppError("Password must be at least 8 characters", 400);
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError("Email already exists", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        location,
      });

      const result = await VerificationService.sendOTP(email);
      if (!result) {
        throw new AppError("Failed to send OTP", 500);
      }
      return {
        email: newUser.email,
        username: newUser.username,
        location: newUser.location,
        verified: newUser.isVerified,
      };
    } catch (err) {
      throw new AppError(err, 500);
    }
  }

  // ---------------- LOGIN ----------------
  async login(email, password) {
    if (!email || !password) throw new AppError("All fields are required", 400);

    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 400);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError("Invalid password", 401);

    if (!user.isVerified) throw new AppError("User was not verified");

    //Access Token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRE }
    );

    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        location: user.location,
      },
    };
  }

  // ---------------- ACTIVE USER ----------------
  async activeUser(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new AppError("User not found", 400);

      await VerificationService.sendVerifyEmail(email);
      user.isVerified = true;
      await user.save();
    } catch (err) {
      throw new AppError(err, 500);
    }
  }

  // ---------------- LOCK USER ----------------
  async lockUser(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new AppError("User not found", 400);

      user.isVerified = false;
      await user.save();
    } catch (err) {
      throw new AppError(err, 500);
    }
  }
  // ---------------- CHANGE PASSWORD ----------------
  async forgotPassword(email) {
    try {
      if (!email) throw new AppError("All fields are required", 400);

      const user = await User.findOne({ email });
      if (!user) throw new AppError("User not found", 400);

      return await VerificationService.sendOTP(email);
    } catch (err) {
      throw new AppError(err);
    }
  }
  // ---------------- GET TMP TOKEN ----------------
  async getTmpToken(email) {
    const user = await User.findOne({ email });
    if (!user)
      throw new AppError("User not found", 400);

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRE }
    );

    return accessToken;
  }

  // ---------------- CHANGE PASSWORD ----------------
  async changePassword(email, newPassword) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new AppError("User not found", 400);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
    } catch (err) {
      throw new AppError(err);
    }
  }

  // ---------------- Get My Info -------------------
  async getMyInfo(id) {
    try {
      const user = await User.findById(id);
      if (!user) throw new AppError("User not found", 400);

      return {
        id: user._id,
        username: user.username,
        role: user.role,
        location: user.location,
        avatar: user.avatar
      }
    }
    catch (err) {
      throw new AppError(err);
    }
  }

  // ---------------- Update Avatar -------------------
  async updateAvatar(uploaderId, filePath) {
    try {
      // Import cloudinary and fs dynamically
      const { v2: cloudinary } = await import('cloudinary');
      const fs = await import('fs');

      // Upload directly to Cloudinary (avatars folder) without creating Image record
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "clondy_api/avatars",
      });

      // Delete temp file after upload
      fs.unlinkSync(filePath);

      // Update user's avatar field
      const user = await User.findById(uploaderId);
      if (!user) throw new AppError("User not found", 404);

      user.avatar = result.secure_url;
      await user.save();

      return "Avatar updated";
    }
    catch (err) {
      throw new AppError(err);
    }
  }
  // ---------------- Send Report -------------------
  async sendReport(senderId, title, content, type) {
    try {
      const newReport = await Report.create({
        senderId,
        title,
        content,
        type
      });
      return newReport;
    }
    catch (err) {
      throw new AppError(err);
    }
  }

  // ---------------- Get All Reports -------------------
  async getAllReports() {
    try {
      const reports = await Report.find()
        .populate('senderId', 'username email')
      return reports;
    }
    catch (err) {
      throw new AppError(err);
    }
  }

  // ---------------- Delete Report -------------------
  async deleteReport(reportId) {
    try {
      const report = await Report.findById(reportId);
      if (!report) throw new AppError("Report not found", 404);
      await Report.findByIdAndDelete(reportId);
      return "Report deleted";
    }
    catch (err) {
      throw new AppError(err);
    }
  }


  // ---------------- Admin Register ----------------
  async adminRegister({ email, username, password }) {
    try {
      if (!email || !username || !password) {
        throw new AppError("All fields are required", 400);
      }
      if (password.length < 8) {
        throw new AppError("Password must be at least 8 characters", 400);
      }
      const existingUser = await User.findOne({ email, role: ROLE_LISTS.ADMIN });
      if (existingUser) {
        throw new AppError("Email already exists", 400);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        role: ROLE_LISTS.ADMIN
      });
      await VerificationService.sendOTP(email);
      return {
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        verified: newUser.isVerified,
      };
    } catch (err) {
      throw new AppError(err, 500);
    }
  }

  // ---------------- Admin LOGIN ----------------
  async adminLogin(email, password) {
    if (!email || !password) throw new AppError("All fields are required", 400);
    const user = await User.findOne({ email, role: ROLE_LISTS.ADMIN });
    if (!user) throw new AppError("Admin not found", 400);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError("Invalid password", 401);
    if (!user.isVerified) throw new AppError("Admin was not verified");
    //Access Token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRE }
    );
    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        location: user.location,
      },
    };
  }
  // ---------------- Set Area Admin ----------------
  async setAreaAdmin(adminId, area) {
    try {
      if (!adminId || !area) throw new Error("adminId and area is required");

      if (!AREA_BY_REGION[area])
        throw new Error("Invalid area region");

      const newArea = await Area.create({
        adminId,
        areaManagement: AREA_BY_REGION[area]
      });

      return newArea;

    } catch (err) {
      throw err;
    }
  }

  // ---------------- Get Area Admin ----------------
  async getArea(adminId) {
    try {
      const areaDoc = await Area.findOne({ adminId });
      if (!areaDoc) throw new Error("adminDoc not find");
      return {
        area: areaDoc ? areaDoc.areaManagement : null
      };
    } catch (err) {
      throw err;
    }
  }

  // ---------------- Get Users By Location ----------------
  async getUsersByLocation(area) {
    if (!area) throw new Error("Area is required");
    try {
      const usersByLocation = await User.find({
        location: area,
        role: ROLE_LISTS.USER
      });

      return usersByLocation;
    } catch (err) {
      throw err;
    }
  }

  // ---------------- View Disabled Users ----------------
  async viewDisabledUsers() {
    try {
      const disabledUsers = await User.find({
        isVerified: false,
        role: ROLE_LISTS.USER
      });
      return disabledUsers;
    } catch (err) {
      throw err;
    }
  }

  // ---------------- Enable User ----------------
  async enablekUser(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new AppError("User not found", 400);
      user.isVerified = true;
      await user.save();
      return "User enabled";
    } catch (err) {
      throw new AppError(err);
    }
  }

  // ---------------- Change Name ----------------
  async changeName(userId, newName) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new AppError("User not found", 400);
      user.username = newName;
      await user.save();
      return "Name changed";
    } catch (err) {
      throw new AppError(err);
    }
  }
}

export default new UserService();
