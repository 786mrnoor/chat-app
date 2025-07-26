import mongoose from 'mongoose';

import Conversation from '../../models/conversation-model.js';

async function getConversations(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const conversations = await Conversation.aggregate([
      // Stage 1: Match conversations where the current user is a member
      {
        $match: {
          members: userId,
        },
      },
      // Stage 2: Perform a left outer join with the 'messages' collection
      // to find all messages in this conversation that are UNSEEN by the current user.
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'conversationId',
          as: 'unseenMessages', // The new array field to add to the output documents
          // Sub-pipeline to filter messages *within* the lookup
          pipeline: [
            {
              $match: {
                // Messages not sent by the current user
                senderId: { $ne: userId },
                // Messages that haven't been read by the current user
                // (assuming readAt is null if not read)
                readAt: null,
              },
            },
          ],
        },
      },
      // Stage 3: Add unseenCount field
      {
        $addFields: {
          unseenCount: { $size: '$unseenMessages' },
        },
      },
      // Stage 4: Populate 'members' details (all members for now, will filter/project in next stage)
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'allMemberDetails', // Use a temporary name to hold all member details

          // users other than the current user
          pipeline: [
            {
              $match: {
                _id: { $ne: userId },
              },
            },
            {
              $unset: ['password', '__v'],
            },
          ],
        },
      },
      // Stage 5: Populate 'lastMessage' details
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessageDetails',
        },
      },
      // Stage 6: Sort conversations by last message timestamp
      {
        $sort: {
          lastMessageTimestamp: -1,
        },
      },
      // Stage 7: Project to reshape the output documents and select desired fields
      {
        $project: {
          _id: 1,
          type: 1,
          // For individual chats, 'name' will be null. Frontend will derive from 'otherMember'.
          // For group chats, 'name' will be populated if it exists.
          name: 1,
          clientId: 1,
          unseenCount: 1,
          lastMessage: {
            $arrayElemAt: ['$lastMessageDetails', 0],
          },
          lastMessageSender: 1,
          lastMessageTimestamp: 1,
          // NEW LOGIC FOR 'members' and 'otherMember'
          members: {
            // Keep the array for groups
            $cond: {
              if: { $eq: ['$type', 'group'] },
              then: '$allMemberDetails',
              else: [], // For individual type, members will be derived as 'otherMember'
            },
          },
          // NEW FIELD: 'otherUser' for individual chats
          otherUser: {
            $cond: {
              if: { $eq: ['$type', 'individual'] },
              then: {
                $arrayElemAt: ['$allMemberDetails', 0], // Get the first (and only) element which is the other user
              },
              else: null, // Not applicable for group chats
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    // console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error fetching conversations', error: error.message });
  }
}

export default getConversations;
