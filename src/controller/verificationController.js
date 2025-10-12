import VerificationService from "../service/VerificationService.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";

class VerificationController {
    index(req, res) {
        return ApiResponse.success(res, 'Verification is active');
    }

    async sendOTP(req, res) {
        try {
            const {email} = req.body
            const result = await VerificationService.sendOTP(email);
            return ApiResponse.success(res, result);
        }
        catch(err) {
            throw new AppError('Error: '+err, 500);
        }
    }
}