import adminService from "../service/AdminService.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";

class AdminController {
  index(req, res) {
    return ApiResponse.success(res, 'Admin router running...');
  }

  async registerAdmin(req, res, next) {
    try {
      const result = await adminService.registerAdmin(req.body);
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async getAllReports(req, res, next) {
    try {
      const result = await adminService.getAllReports();
      return ApiResponse.success(res, result);
    }
    catch(err) {
      next(err);
    }
  }

  async deleteReport(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError('Report ID is required', 400);
      }
      
      await adminService.deleteReport(id);
      return ApiResponse.success(res, 'Report deleted successfully');
    }
    catch(err) {
      next(err);
    }
  }
}

export default new AdminController();
