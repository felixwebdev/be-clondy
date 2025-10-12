// services/UserService.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import VerificationService from "./VerificationService.js";
import AppError from "../utils/AppError.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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

      await VerificationService.sendOTP(email);

      return {
        email: newUser.email,
        username: newUser.username,
        location: newUser.location,
        verified: newUser.isVerified,
      };
    } catch (err) {
      throw new AppError("Error: " + err, 500);
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

      user.isVerified = true;
      await user.save();
    } catch (err) {
      throw new AppError("Error: " + err, 500);
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
      throw new AppError("Error: " + err, 500);
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
      throw new AppError("Error: " + err);
    }
  }
  // ---------------- GET TMP TOKEN ----------------
  async getTmpToken(email){
    const user = await User.findOne({ email });
    if (!user) 
      throw new AppError("User not found", 400);

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role},
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
      user.save();
    } catch (err) {
      throw new AppError("Error: " + err);
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
    catch(err) {
      throw new AppError(err);
    }
  }
}

export default new UserService();
