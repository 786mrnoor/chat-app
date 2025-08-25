import logger from '../../helpers/logger.js';
import ConversationModel from '../../models/conversation-model.js';
import MessageModel from '../../models/message-model.js';

export default async function groupEvent(groupId, type, data, callback) {
  try {
    let conversationUpdate;
    let message;
    if (type === 'group_photo_change') {
      conversationUpdate = { iconUrl: data.iconUrl };

      message = {
        conversationId: groupId,
        senderId: this.user._id,
        type: 'system',
        meta: {
          type: 'group_photo_change',
          actorId: this.user._id,
        },
      };
    }

    const group = await ConversationModel.findOneAndUpdate(
      { _id: groupId, members: this.user?._id },
      conversationUpdate,
      { runValidators: true, new: true, upsert: false, lean: true, select: '_id' } // upsert false to avoid creating a new group if it doesn't exist
    ).exec();

    if (!group) {
      throw new Error('Group not found or you are not a member');
    }

    const saveMessage = new MessageModel(message);
    await saveMessage.save();

    let payload = {
      groupId,
      updates: {
        ...conversationUpdate,
        updatedBy: this.user._id,
      },
      message: saveMessage,
    };

    this.server.to(groupId).emit('group:events', type, payload);

    callback({ success: true });
  } catch (error) {
    logger.error('Error updating user details:', error);
    callback({ message: error.message || error, error: true });
  }
}
