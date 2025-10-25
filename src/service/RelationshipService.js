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
}

export default new RelationshipService();