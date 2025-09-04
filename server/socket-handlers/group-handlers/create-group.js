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
      .populate({
        path: 'members',
        select: 'name email profileUrl isOnline lastSeen',
      }) // with the current user
      .populate('lastMessage')
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

      let lastMessage = new MessageModel({
        conversationId: group._id,
        senderId: user._id,
        type: 'system',
        meta: {
          type: 'group_created',
          actorId: user._id,
          groupName: group.name,
        },
      });
      await lastMessage.save();

      // if there are members then create system join messages
      // make it to lastMessage
      if (members.length > 0) {
        let membersJoinMessages = members.map((member) => ({
          conversationId: group._id,
          senderId: user._id,
          type: 'system',
          meta: {
            type: 'user_added',
            actorId: user._id,
            targetId: member._id,
          },
        }));

        membersJoinMessages = await MessageModel.insertMany(membersJoinMessages, {
          rawResult: false,
          lean: false,
        });
        lastMessage = membersJoinMessages.at(-1);
      }

      group.lastMessage = lastMessage._id;
      group.lastMessageSender = user?._id;
      group.lastMessageTimestamp = lastMessage.createdAt;

      await group.save();

      // attach the populated members to the group
      group = group.toObject();
      group.lastMessage = lastMessage;
      group.members = [user, ...members];
    }
    logger.log(group);

    callback({
      success: true,
      data: group,
    });

    // members include the creator
    const groupMembersIds = group.members.map((m) => m?._id?.toString());
    // join members to the group room including the creator
    this.server.in(groupMembersIds).socketsJoin(group?._id?.toString());

    //emit group:created event to all group members including the creator but excluding the current socket
    this.to(group?._id?.toString()).emit('group:created', group);
  } catch (error) {
    logger.error(error);
    callback({
      error: true,
      message: error.message || error || 'An error occurred while creating the group.',
    });
  }
}
