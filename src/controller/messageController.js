import MessageService from "../service/MessageService.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { io, getSocketIdByUserId } from "../socket/socket.js";
import ChatRoomService from "../service/ChatRoomService.js";

class messageController {
    async index(req, res, next) {
        try {
            return ApiResponse.success(res, "Message Controller is working");
        } catch (error) {
            next(error);
        }  
    }

    async sendMessage(req, res, next) {
        try {
            const { chatRoomId, content } = req.body;
            const senderId = req.user.id;
            const message = await MessageService.sendMessage(chatRoomId, senderId, content);
            const receiverId = await ChatRoomService.getReceiverId(chatRoomId, senderId);
            if (message) {
                const socketId = getSocketIdByUserId(receiverId);
                console.log("ReceiverId:", receiverId);
                if (socketId) {
                    io.to(socketId).emit("newMessage", message);
                    console.log("New message sent to socketId:", socketId);
                }
                return ApiResponse.success(res, message);
            }
        } catch (error) {
            next(error);
        }    
    }

    async getMessagesByChatRoomId(req, res, next) {
        try {
            const { chatRoomId } = req.params;
            const messages = await MessageService.getMessagesByChatRoomId(chatRoomId);
            return ApiResponse.success(res, messages);
        } catch (error) {
            next(error);
        }
    }

    async getAllChatRooms(req, res, next) {
        try {
            const userId  = req.user.id;
            const chatRooms = await ChatRoomService.getAllChatRoom(userId);
            return ApiResponse.success(res, chatRooms);
        } catch (error) {
            next(error);
        }
    }
    
}

export default new messageController();