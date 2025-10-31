import Message from '../models/Message.js';
import ChatRoom from '../models/ChatRoom.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';

class MessageService {
    async sendMessage(chatRoomId, senderId, content) {
        if (!chatRoomId || !senderId || !content) 
            throw new AppError("All fields are request");

        const chatRoom = await ChatRoom.exists({_id: chatRoomId});
        const sender = await User.exists({_id: senderId});

        if (!chatRoom || !sender)
            throw new AppError("ChatRoom or Sender does not exist");

        const message = await Message.create({
            chatRoomId,
            senderId,
            content
        })

        const chatRoomUpdate = await ChatRoom.findByIdAndUpdate(chatRoomId,{
            lastMessageId: message._id,
            lastSenderId: senderId,
            lastMessage: content,
            lastMessageAt: new Date()
        })

        if (!message || !chatRoomUpdate) 
            throw new AppError("Error when send message");

        return message;
    }
}

export default new MessageService();