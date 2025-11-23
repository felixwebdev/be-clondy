import ChatRoomService from "../service/ChatRoomService.js";
import ApiResponse from "../utils/ApiResponse.js";

class ChatRoomController {
    index(req, res) {
        res.json("ChatRoom routes is actived");
    }

    async getAllChatRoom(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await ChatRoomService.getAllChatRoom(userId);

            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }

    async getOrCreateChatRoom(req, res, next) {
        try {
            const userId1 = req.user.id; // Current user
            const { userId2 } = req.body; // The other user to chat with

            const result = await ChatRoomService.getOrCreateChatRoom(userId1, userId2);

            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }
}

export default new ChatRoomController();