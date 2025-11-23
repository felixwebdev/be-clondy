import mongoose from 'mongoose';
import ChatRoom from '../models/ChatRoom.js';
import connectDB from '../config/db.js';

async function cleanDuplicateChatRooms() {
    try {
        await connectDB();
        console.log('🔍 Finding duplicate chat rooms...');

        const allChatRooms = await ChatRoom.find({});
        console.log(`📊 Total chat rooms: ${allChatRooms.length}`);

        const seen = new Map();
        const toDelete = [];

        for (const room of allChatRooms) {
            const id1 = room.userId1.toString();
            const id2 = room.userId2.toString();
            
            // Create a normalized key (smaller ID first)
            const key = id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

            if (seen.has(key)) {
                // Duplicate found! Keep the older one (or the one with messages)
                const existing = seen.get(key);
                
                // Keep the one with more recent activity
                if (room.lastMessageAt && (!existing.lastMessageAt || room.lastMessageAt > existing.lastMessageAt)) {
                    toDelete.push(existing._id);
                    seen.set(key, room);
                    console.log(`🔄 Replacing ${existing._id} with ${room._id} (has newer messages)`);
                } else {
                    toDelete.push(room._id);
                    console.log(`❌ Marking ${room._id} for deletion (duplicate of ${existing._id})`);
                }
            } else {
                seen.set(key, room);
            }
        }

        if (toDelete.length > 0) {
            console.log(`\n🗑️  Deleting ${toDelete.length} duplicate chat rooms...`);
            const result = await ChatRoom.deleteMany({ _id: { $in: toDelete } });
            console.log(`✅ Deleted ${result.deletedCount} duplicate chat rooms`);
        } else {
            console.log('✅ No duplicate chat rooms found');
        }

        // Now normalize remaining rooms (ensure userId1 < userId2)
        console.log('\n🔧 Normalizing remaining chat rooms...');
        const remainingRooms = await ChatRoom.find({});
        let normalized = 0;

        for (const room of remainingRooms) {
            const id1 = room.userId1.toString();
            const id2 = room.userId2.toString();

            if (id1 > id2) {
                // Need to swap
                room.userId1 = room.userId2;
                room.userId2 = mongoose.Types.ObjectId(id1);
                await room.save();
                normalized++;
                console.log(`🔄 Normalized room ${room._id}`);
            }
        }

        console.log(`✅ Normalized ${normalized} chat rooms`);
        console.log('\n✨ Cleanup complete!');
        console.log(`📊 Final count: ${remainingRooms.length} chat rooms`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning duplicates:', error);
        process.exit(1);
    }
}

cleanDuplicateChatRooms();
