import RELATION from "../config/relation_Status.js";
import Relationship from "../models/Relationship.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

class RelationshipService {
    async addFriend(senderId, receiverId) {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) 
            throw new AppError("Sender or Receiver not found");
    
        const res = await Relationship.create({
            senderId: senderId,
            receiverId: receiverId,
        })

        return res;
    }

    async acceptRequest(receiverId, senderId) {
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) 
            throw new AppError("Sender or Receiver not found");

        const relationship = await Relationship.findOneAndUpdate(
            { senderId: senderId, receiverId: receiverId, status: RELATION.WAITING },
            { status: RELATION.ACCEPTED },
            { new: true }
        );

        return relationship;
    }

    async cancelRequest(userId1, userId2) {
        const user1 = await User.findById(userId1);
        const user2 = await User.findById(userId2);

        if (!user1 || !user2) 
            throw new AppError("Users not found");

        const relationship = await Relationship.findOneAndUpdate(
            { 
                $or: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 }
                ]
            },
            { status: RELATION.CANCELED },
            { new: true }
        );
        return relationship;
    }
}

export default new RelationshipService();