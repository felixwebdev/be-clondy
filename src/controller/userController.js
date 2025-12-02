import User from "../models/User.js";
import userService from "../service/UserService.js";
import VerificationService from "../service/VerificationService.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import REPORT_TYPE from "../config/report_Type.js";

class UserController {
  index(req, res) {
    res.send("Index router User");
  }

  async register(req, res, next) {
    try {
      const result = await userService.register(req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err); 
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const result = await userService.login(email, password);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async verifyUser(req, res, next) {
    try {
        const {email, otp} = req.body;
        const isVerified = await VerificationService.verifyCode(email, otp);
        if (!isVerified) throw new AppError('Invalid OTP or email');
        userService.activeUser(email);
        return ApiResponse.success(res,isVerified);
    }
    catch(err) {
        next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const {email} = req.body;
      const result = await userService.forgotPassword(email);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async verifyCodeForgotPassword(req, res, next) {
    try{
      const {email, otp} = req.body;
      const isVerified = await VerificationService.verifyCode(email, otp);
      if (!isVerified) throw new AppError('Invalid OTP');

      const result = await userService.getTmpToken(email);
      return ApiResponse.success(res,result);
    }
    catch(err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try{
      const user = req.user;
      const email = user.email;
      const {password} = req.body; 
      userService.changePassword(email, password);

      return ApiResponse.success(res, 'Password has been updated');
    }
    catch(err) {
      next(err);
    }
  }

  async getMyInfo(req, res, next) {
    try{
      const id = req.user.id;
      const result = await userService.getMyInfo(id);

      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      const filePath = req.file.path;
      const uploaderId = req.user.id;

      const result = await userService.updateAvatar(uploaderId, filePath);
      return ApiResponse.success(res, result);
    }
    catch(err){
      next(err);
    }
  }

  async sendReport(req, res, next) {
    try {
      const senderId = req.user.id;
      const type = REPORT_TYPE.REPORT;
      const {title, content} = req.body;
      const result = await userService.sendReport(senderId, title, content, type);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async sendFeedback(req, res, next) {
    try {
      const senderId = req.user.id;
      const type = REPORT_TYPE.SUGGESTION;
      const {title, content} = req.body;
      const result = await userService.sendReport(senderId, title, content, type);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async getAllReports(req, res, next) {
    try {
      const result = await userService.getAllReports();
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async deleteReport(req, res, next) {
    try {
      const {reportId} = req.body;
      const result = await userService.deleteReport(reportId);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async adminRegister(req, res, next) {
    try {
      const result = await userService.adminRegister(req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err); 
    }
  }

  async adminLogin(req, res, next) {
    try {
      const {email, password} = req.body;
      const result = await userService.adminLogin(email, password);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async setAreaAdmin(req, res, next) {
    try {
      const {adminId, area} = req.body;
      const result = await userService.setAreaAdmin(adminId, area);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async getArea(req, res, next) {
    try {
      const adminId = req.user.id; 
      const result = await userService.getArea(adminId);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    } 
  }

  async getUsersByLocation(req, res, next) {
    try {
      const {area} = req.body;
      const result = await userService.getUsersByLocation(area);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async lockUser(req, res, next) {
    try {
      const {email} = req.body;
      const result = await userService.lockUser(email);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async viewDisabledUsers(req, res, next) {
    try {
      const result = await userService.viewDisabledUsers();
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async enableUser(req, res, next) {
    try {
      const {email} = req.body;
      const result = await userService.enablekUser(email);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async changeName(req, res, next) {
    try {
      const userId = req.user.id;
      const {newName} = req.body;
      const result = await userService.changeName(userId, newName);
      return ApiResponse.success(res, result);
    } 
    catch(err) {
      next(err);
    }
  }
}

export default new UserController();
