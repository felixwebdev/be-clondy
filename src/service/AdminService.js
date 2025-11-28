import Report from "../models/Report.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import ROLE_LISTS from "../config/role_List.js";

class AdminService {
  // Register admin account
  async registerAdmin({ email, username, password, secretKey }) {
    try {
      // Verify secret key (you should set this in .env)
      const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "clondy_admin_2024";
      if (secretKey !== ADMIN_SECRET) {
        throw new AppError("Invalid secret key", 403);
      }

      if (!email || !username || !password) {
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
      const newAdmin = await User.create({
        email,
        username,
        password: hashedPassword,
        location: "Admin",
        role: ROLE_LISTS.ADMIN,
        isVerified: true, // Admin auto-verified
      });

      return {
        email: newAdmin.email,
        username: newAdmin.username,
        role: newAdmin.role,
      };
    } catch (err) {
      throw new AppError(err);
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      // Fetch all users except admins (optional: filter by role)
      const users = await User.find({ role: ROLE_LISTS.USER })
        .select("-password") // Exclude password
        .sort({ createdAt: -1 })
        .lean();

      return users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        location: user.location,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }));
    } catch (err) {
      throw new AppError(err);
    }
  }

  // Get all reports with user info
  async getAllReports() {
    try {
      const reports = await Report.find()
        .populate('userId', 'username email avatar')
        .sort({ createdAt: -1 })
        .lean();

      return reports.map(report => ({
        id: report._id,
        title: report.title,
        content: report.content,
        status: report.status,
        from: report.userId?.username || 'Unknown User',
        userEmail: report.userId?.email || '',
        userAvatar: report.userId?.avatar || null,
        date: report.createdAt,
        userId: report.userId?._id
      }));
    } catch (err) {
      throw new AppError(err);
    }
  }

  // Delete a report
  async deleteReport(reportId) {
    try {
      const report = await Report.findById(reportId);

      if (!report) {
        throw new AppError("Report not found", 404);
      }

      await Report.findByIdAndDelete(reportId);
    } catch (err) {
      throw new AppError(err);
    }
  }
}

export default new AdminService();
