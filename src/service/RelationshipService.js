import mongoose from "mongoose";
import RELATION from "../config/relation_Status.js";
import Relationship from "../models/Relationship.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import ChatRoomService from "./ChatRoomService.js"

class RelationshipService {
    async getFriends(userId, _status) {
        const relations = await Relationship.find({
            status: _status,
            $or: [
                { senderId: userId },
                { receiverId: userId },
            ]
            }).lean();

        const friendIds = relations.map(r =>
            String(r.senderId) === String(userId) ? r.receiverId : r.senderId
        );

        const friends = await User.find({ _id: { $in: friendIds } })
            .select("username email avatar location")
            .lean();

        return friends;
    }  

    async getInfoFriend(userId) {
        const user = await User.findById(userId);

        if (!user) 
            throw new AppError("User not found");

        return {
            id: user._id,
            email: user.email,
            username: user.username,
            location: user.location,
        }
    } 

    async addFriend(_senderId, _receiverId) {
        if (_senderId == _receiverId) 
            throw new AppError("Sender and receiver cannot be the same")
    
        const sender = await User.exists({_id: _senderId});
        const receiver = await User.exists({_id: _receiverId});

        if (!sender || !receiver) 
            throw new AppError("Sender or Receiver not found");

        const isExistRelation = await Relationship.findOne({senderId: _senderId, receiverId: _receiverId})
    
        if (isExistRelation)
        {
            if (isExistRelation.status == RELATION.CANCELED) {
                const res = await Relationship.findOneAndUpdate(
                    { senderId: _senderId, receiverId: _receiverId, status: RELATION.CANCELED },
                    { status: RELATION.PENDING },
                    { new: true }
                )
                return res;
            }
            else {
                throw new AppError("Request has been sent");
            }
        }

        const res = await Relationship.create({
            senderId: senderId,
            receiverId: receiverId,
        })

        return res;
    }

    async acceptRequest(receiverId, senderId) {
        const receiver = await User.exists({_id: receiverId});
        const sender = await User.exists({_id: senderId});

        if (!receiver || !sender) 
            throw new AppError("Sender or Receiver not found");

        const isExistRelation = await Relationship.findOne({senderId: senderId, receiverId: receiverId, status: RELATION.PENDING})

        if (!isExistRelation)
            throw new AppError("Relationship is not exist");

        ChatRoomService.createChatRoom(senderId, receiverId);

        const relationship = await Relationship.findOneAndUpdate(
            { senderId: senderId, receiverId: receiverId, status: RELATION.PENDING },
            { status: RELATION.ACCEPTED },
            { new: true }
        );

        return relationship;
    }

    async cancelRequest(userId1, userId2) {
        const user1 = await User.exists({_id: userId1});
        const user2 = await User.exists({_id: userId2});

        if (!user1 || !user2) 
            throw new AppError("Users not found");

        const isExistRelation = await Relationship.findOne({
             $or: [
                    { senderId: userId1, receiverId: userId2, status: RELATION.ACCEPTED },
                    { senderId: userId2, receiverId: userId1, status: RELATION.ACCEPTED }
                ]
        })

        if (!isExistRelation)
            throw new AppError("Relationship is not exist");

        const relationship = await Relationship.findOneAndUpdate(
            { 
                $or: [
                    { senderId: userId1, receiverId: userId2, status: RELATION.ACCEPTED },
                    { senderId: userId2, receiverId: userId1, status: RELATION.ACCEPTED }
                ]
            },
            { status: RELATION.CANCELED },
            { new: true }
        );
        return relationship;
    }
}

export default new RelationshipService();