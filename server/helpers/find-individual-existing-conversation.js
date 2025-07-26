import mongoose from 'mongoose';

import Conversation from '../models/conversation-model.js';

async function findIndividualExistingConversation(senderId, recipientId) {
  // Convert IDs to Mongoose ObjectIds
  const senderObjectId = new mongoose.Types.ObjectId(senderId);
  const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

  // For 1-on-1 chats, we need a consistent way to query for existing conversations
  // to avoid duplicates. Sort the member IDs to ensure uniqueness regardless of order.
  const membersSorted = [senderObjectId, recipientObjectId].sort((a, b) =>
    a.toString().localeCompare(b.toString())
  );

  let conversation = await Conversation.findOne({
    type: 'individual',
    members: { $all: membersSorted, $size: 2 }, // Ensures both are present and only two
  });

  return [conversation, membersSorted];
}

export default findIndividualExistingConversation;
