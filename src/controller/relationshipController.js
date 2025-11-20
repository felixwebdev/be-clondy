import AppError from "../utils/AppError.js";
import RelationshipService from '../service/RelationshipService.js';
import ApiResponse from "../utils/ApiResponse.js";
import {io, getSocketIdByUserId} from "../socket/socket.js"
import RELATION from "../config/relation_Status.js";

class RelationshipController {
    index(req, res) {
        res.send("Index router relationship");
    }

    async getFriends(req, res, next) {
        try {
            const userId = req.user.id;

            if (!userId)
                throw new AppError("All fields are required");

            const result = await RelationshipService.getFriends(userId, RELATION.ACCEPTED);
          
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }

    async findFriend(req, res, next) {
        try {
            const {username} = req.query;
            if (!username)
                throw new AppError("Username is required");
            const result = await RelationshipService.findFriend(username);
            return ApiResponse.success(res, result);
        }  
        catch(err) {
            next(err);
        }
    }

    async getPendingFriends(req, res, next) {
        try {
            const userId = req.user.id;

            if (!userId)
                throw new AppError("All fields are required");

            const result = await RelationshipService.getFriends(userId, RELATION.PENDING);
          
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }

    async addFriend(req, res, next) {
        try {
            const senderId = req.user.id;
            const {receiverId} = req.body;

            if (!senderId || !receiverId) 
                throw new AppError("All fields are required");
            
            const result = await RelationshipService.addFriend(senderId, receiverId);

            const socketId = getSocketIdByUserId(receiverId);

            const sender = RelationshipService.getInfoFriend(senderId);
            io.to(socketId).emit("SendReqAddfriend", sender);

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

            const receiver = RelationshipService.getInfoFriend(receiverId);
            io.to(socketId).emit("AcceptReqAddfriend", receiver);
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