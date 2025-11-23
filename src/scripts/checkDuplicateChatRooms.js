import mongoose from 'mongoose';
import ChatRoom from '../models/ChatRoom.js';
import { connectDB } from '../config/db.js';

async function fixDuplicateChatRooms() {
    try {
        await connectDB();
        console.log('🔍 Fixing duplicate chat rooms...\n');

        const allChatRooms = await ChatRoom.find({});
        console.log(`📊 Total chat rooms: ${allChatRooms.length}\n`);

        const seen = new Map();
        const duplicates = [];

        for (const room of allChatRooms) {
            const id1 = room.userId1.toString();
            const id2 = room.userId2.toString();
            
            // Create a normalized key (smaller ID first)
            const key = id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;

            if (seen.has(key)) {
                duplicates.push({
                    existing: seen.get(key),
                    duplicate: room
                });
                console.log(`❌ DUPLICATE FOUND!`);
                console.log(`   Existing: ${seen.get(key)._id} (${seen.get(key).userId1} - ${seen.get(key).userId2})`);
                console.log(`   Duplicate: ${room._id} (${room.userId1} - ${room.userId2})`);
                console.log('');
            } else {
                seen.set(key, room);
            }
        }

        if (duplicates.length === 0) {
            console.log('✅ No duplicates found!');
        } else {
            console.log(`\n⚠️  Found ${duplicates.length} duplicate chat rooms\n`);
            
            // Delete duplicates, keeping the one with more recent messages
            for (const dup of duplicates) {
                const toDelete = dup.duplicate.lastMessageAt && dup.existing.lastMessageAt
                    ? (dup.duplicate.lastMessageAt > dup.existing.lastMessageAt ? dup.existing : dup.duplicate)
                    : (dup.duplicate.lastMessageAt ? dup.existing : dup.duplicate);
                
                console.log(`🗑️  Deleting: ${toDelete._id}`);
                await ChatRoom.deleteOne({ _id: toDelete._id });
            }
            console.log(`✅ Deleted ${duplicates.length} duplicate chat rooms\n`);
        }

        // Normalize all remaining chat rooms
        console.log('🔧 Normalizing remaining chat rooms...');
        const remainingRooms = await ChatRoom.find({});
        let normalized = 0;

        for (const room of remainingRooms) {
            const id1 = room.userId1.toString();
            const id2 = room.userId2.toString();

            if (id1 > id2) {
                // Need to swap - delete and recreate to avoid unique index conflict
                await ChatRoom.deleteOne({ _id: room._id });
                await ChatRoom.create({
                    userId1: room.userId2,
                    userId2: room.userId1,
                    lastMessageId: room.lastMessageId,
                    lastSenderId: room.lastSenderId,
                    lastMessage: room.lastMessage,
                    lastMessageAt: room.lastMessageAt
                });
                normalized++;
                console.log(`🔄 Normalized room ${room._id}`);
            }
        }

        console.log(`✅ Normalized ${normalized} chat rooms`);
        
        const finalCount = await ChatRoom.countDocuments();
        console.log(`\n✨ Final count: ${finalCount} unique chat rooms`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixDuplicateChatRooms();
