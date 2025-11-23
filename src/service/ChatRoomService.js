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

        // Populate partner information for each chat room
        const populatedChatRooms = await Promise.all(
            chatRooms.map(async (room) => {
                // Determine who is the partner (the other user)
                const partnerId = room.userId1.toString() === userId.toString() 
                    ? room.userId2 
                    : room.userId1;
                
                // Get partner's user info
                const partner = await User.findById(partnerId).select('username avatar');
                
                return {
                    id: room._id,
                    userId1: room.userId1,
                    userId2: room.userId2,
                    partnerName: partner ? partner.username : 'Unknown',
                    partnerAvatar: partner ? partner.avatar : null,
                    lastMessage: room.lastMessage || 'No messages yet',
                    lastAt: room.lastAt,
                    unreadCount: 0 // You can add logic for unread count later
                };
            })
        );

        return populatedChatRooms;
    }

    async getReceiverId(chatRoomId, senderId) {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (chatRoom.userId1 == senderId) {
            return chatRoom.userId2.toString();
        } else {
            return chatRoom.userId1.toString();
        }
    }

    async getOrCreateChatRoom(userId1, userId2) {
        if (!userId1 || !userId2) 
            throw new AppError("Both user IDs are required");

        // Normalize order: ensure smaller ID is always userId1
        const id1Str = userId1.toString();
        const id2Str = userId2.toString();
        const [smallerId, largerId] = id1Str < id2Str ? [userId1, userId2] : [userId2, userId1];

        // Check if chat room already exists (now only need to check one combination)
        let chatRoom = await ChatRoom.findOne({
            userId1: smallerId,
            userId2: largerId
        });

        // If doesn't exist, create new one
        if (!chatRoom) {
            const user1 = await User.exists({_id: smallerId});
            const user2 = await User.exists({_id: largerId});

            if (!user1 || !user2) 
                throw new AppError("One or both users do not exist");

            chatRoom = await ChatRoom.create({
                userId1: smallerId,
                userId2: largerId,
            });
        }

        // Get partner info for response
        const partnerId = chatRoom.userId1.toString() === userId1.toString() 
            ? chatRoom.userId2 
            : chatRoom.userId1;
        
        const partner = await User.findById(partnerId).select('username avatar');

        return {
            id: chatRoom._id,
            userId1: chatRoom.userId1,
            userId2: chatRoom.userId2,
            partnerName: partner ? partner.username : 'Unknown',
            partnerAvatar: partner ? partner.avatar : null,
        };
    }
}   

export default new ChatRoomService();