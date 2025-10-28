import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

class ChatRoomService {
    async createChatRoom(userId1, userId2) {
        if (!userId1 || !userId2) 
            throw new AppError("All fields are request");

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
}   

export default new ChatRoomService();