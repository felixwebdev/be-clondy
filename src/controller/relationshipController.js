import AppError from "../utils/AppError.js";
import RelationshipService from '../service/RelationshipService.js';
import ApiResponse from "../utils/ApiResponse.js";
import {io, getSocketIdByUserId} from "../socket/socket.js"

class RelationshipController {
    index(req, res) {
        res.send("Index router relationship");
    }

    async addFriend(req, res, next) {
        try {
            const senderId = req.user.id;
            const {receiverId} = req.body;

            if (!senderId || !receiverId) 
                throw new AppError("All fields are required");
            
            const result = await RelationshipService.addFriend(senderId, receiverId);

            const socketId = getSocketIdByUserId(receiverId);

            io.to(socketId).emit("SendReqAddfriend", {
                senderId: senderId,
                receiverId: receiverId,
                message: "You have a new friend request",
            });

            return ApiResponse.success(res, result);
        }
        catch (err) {
            next(err);
        }
    }     

    async acceptRequest(req, res, next) {
        try {
            const receiverId = req.user.id;
            const {senderId} = req.body;
            if (!receiverId || !senderId) 
                throw new AppError("All fields are required");
            const result = await RelationshipService.acceptRequest(receiverId, senderId);

            const socketId = getSocketIdByUserId(senderId);
            io.to(socketId).emit("AcceptReqAddfriend", {
                senderId: senderId,
                receiverId: receiverId,
                message: "Your friend request has been accepted",
            });
            return ApiResponse.success(res, result);
        }
        catch (err) {
            next(err);
        }
    }

    async cancelRequest(req, res, next) {
        try {
            const userId1 = req.user.id;
            const {userId2} = req.body;
            if (!userId1 || !userId2) 
                throw new AppError("All fields are required");
            const result = await RelationshipService.cancelRequest(userId1, userId2);
            return ApiResponse.success(res, result);
        }
        catch (err) {
            next(err);
        }
    }
}

export default new RelationshipController();