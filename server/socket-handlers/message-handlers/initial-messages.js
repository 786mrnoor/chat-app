import logger from '../../helpers/logger.js';
import MessageModel from '../../models/message-model.js';

async function initialMessages(conversationId, callback) {
  if (!conversationId) {
    callback({ error: 'Conversation ID is required.' });
    return;
  }
  try {
    // mark the unread messages as read
    const userId = this.user?._id;

    const unseenMessages = await MessageModel.find({
      conversationId,
      readAt: null,
      senderId: { $ne: userId },
    })
      .select('_id senderId conversationId readAt')
      .exec();
    if (unseenMessages.length > 0) {
      let readAt = new Date();
      const messageIds = unseenMessages.map((msg) => msg._id);
      await MessageModel.updateMany({ _id: { $in: messageIds } }, { $set: { readAt } });

      unseenMessages.forEach((msg) => {
        let payload = {
          messageId: msg._id,
          conversationId,
          readAt,
          senderId: msg.senderId,
        };

        // if the same user is on the another tab
        let emitTo = [userId.toString()];

        const senderId = msg.senderId.toString();
        if (this.onlineUsers.has(senderId)) {
          emitTo.push(senderId);
        }
        this.to(emitTo).emit('message:read', payload);
      });
    }

    // get all the messages
    const messages = await MessageModel.find({ conversationId })
      .sort({ createdAt: -1 })
      // .limit(10) // Fetch last 30 messages
      .lean()
      .exec();

    callback({
      success: true,
      data: messages,
    });
  } catch (error) {
    logger.error('Error fetching initial messages:', error);
    callback({
      error: true,
      message: 'Failed to fetch initial messages',
    });
  }
}

export default initialMessages;
