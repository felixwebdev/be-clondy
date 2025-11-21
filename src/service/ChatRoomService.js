import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

class ChatRoomService {
    async createChatRoom(userId1, userId2) {
        if (!userId1 || !userId2) 
            throw new AppError("All fields are required");

        const user1 = await User.exists({_id: userId1});
        const user2 = await User.exists({_id: userId2});

        if (!user1 || !user2) 
            throw new AppError("user1 or user2 is not exist");

        const newChatRoom = await ChatRoom.create({
            userId1: userId1,
            userId2: userId2,
        })

        return newChatRoom;
    }


    async getAllChatRoom(userId) {
        if (!userId) 
            throw new AppError("All fields are required");

        const user = await User.exists({_id: userId});

        if (!user) 
            throw new AppError("User not found");

        const chatRooms = await ChatRoom.find({
            $or: [
                {userId1: userId},
                {userId2: userId}
            ]
        })

        if (chatRooms.length === 0 )
            throw new AppError("No chat rooms found for this user");

        return chatRooms;
    }

    async getReceiverId(chatRoomId, senderId) {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (chatRoom.userId1 == senderId) {
            return chatRoom.userId2.toString();
        } else {
            return chatRoom.userId1.toString();
        }
    }
}   

export default new ChatRoomService();