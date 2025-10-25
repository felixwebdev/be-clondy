import AppError from "../utils/AppError.js";
import RelationshipService from '../service/RelationshipService.js';
import ApiResponse from "../utils/ApiResponse.js";
import {getIO} from "../socket/socket.js"

class RelationshipController {
    index(req, res) {
        res.send("Index router relationship");
    }

    async addFriend(req, res, next) {
        try {
            const senderId = req.user._id;
            const {receiverId} = req.body;

            if (!senderId || !receiverId) 
                throw new AppError("All fields are required");
            
            const result = await RelationshipService.addFriend(senderId, receiverId);

            getIO().emit("SendReqAddfriend");

            return ApiResponse.success(res, result);
        }
        catch (err) {
            next(err);
        }
    }     
}

export default new RelationshipController();