import logger from '../../helpers/logger.js';
import ConversationModel from '../../models/conversation-model.js';
import MessageModel from '../../models/message-model.js';
import UserModel from '../../models/user-model.js';

export default async function createGroup({ clientId, name, description, members = [] }, callback) {
  try {
    //check if group already exist with clientId
    const user = this.user;

    let group = await ConversationModel.findOne({
      clientId,
      type: 'group',
      members: user._id,
    })
      .lean()
      .exec();

    //if not exist, create group
    if (!group) {
      //check if members are valid users
      if (Array.isArray(members) && members.length > 0) {
        members = await UserModel.find({
          _id: { $in: members },
        })
          .select('name email profileUrl isOnline lastSeen')
          .lean()
          .exec();
      }

      //create group
      group = new ConversationModel({
        clientId,
        name,
        description,
        type: 'group',
        members: [user._id, ...members],
        createdBy: user._id,
      });
      await group.save();
      //generate system message
      let message = new MessageModel({
        conversationId: group._id,
        senderId: user._id,
        type: 'system',
        meta: {
          type: 'group_created',
          actorId: user._id,
          groupName: group.name,
        },
      });
      await message.save();

      group.lastMessage = message;
      group.lastMessageSender = user._id;
      group.lastMessageTimestamp = message.createdAt;

      await group.save();
    }
    let payload = group.toObject();
    payload.members = members;
    callback({
      success: true,
      data: payload,
    });

    const groupMembersIds = group.members.map((id) => id.toString());
    // join members to the group room including the creator
    this.server.in(groupMembersIds).socketsJoin(group?._id?.toString());

    //emit group:created event to all group members including the creator but excluding the current socket
    payload.members.push(user);
    this.to(groupMembersIds).emit('group:created', payload);
  } catch (error) {
    logger.error(error);
    callback({
      error: true,
      message: error.message || error || 'An error occurred while creating the group.',
    });
  }
}
