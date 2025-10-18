import imageService from "../service/ImageService.js";
import ApiResponse from "../utils/ApiResponse.js";

class ImageController {
    index(req, res) {
        return ApiResponse.success('Image router running...');
    }

    async uploadImage(req, res, next) {
        try {
            const filePath = req.file.path;
            const uploaderId = req.user.id;
            const {title} = req.body;

            const result = await imageService.uploadImage(uploaderId, filePath, title);
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }
}

export default new ImageController();