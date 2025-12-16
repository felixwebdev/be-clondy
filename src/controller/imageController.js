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

    async getMyImages(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await imageService.getMyImages(userId);
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }

    async getAllImages(req, res, next) {
        try {
            const result = await imageService.getAllImages();
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }

    async getFriendsImages(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await imageService.getFriendsImages(userId);
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }

    async deleteImage(req, res, next) {
        try {
            const userId = req.user.id;
            const {imageId} = req.params;
            const result = await imageService.deleteImage(userId, imageId);
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }
}

export default new ImageController();