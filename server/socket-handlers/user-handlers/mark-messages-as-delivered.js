import ConversationModel from '../../models/conversation-model.js';
import MessageModel from '../../models/message-model.js';

async function markMessagesAsDelivered(io, onlineUsers, userId) {
  try {
    const conversations = await ConversationModel.find({ members: userId }).select('_id');
    const conversationIds = conversations.map((c) => c._id);

    // 1. Find undelivered messages not sent by the user
    const undeliveredMessages = await MessageModel.find({
      conversationId: { $in: conversationIds },
      senderId: { $ne: userId },
      deliveredAt: null,
    }).select('_id senderId conversationId');

    // 2. Bulk update
    const messageIds = undeliveredMessages.map((msg) => msg._id);
    await MessageModel.updateMany(
      { _id: { $in: messageIds } },
      { $set: { deliveredAt: new Date() } }
    );

    // 3. Notify
    undeliveredMessages.forEach((msg) => {
      const senderId = msg.senderId.toString();
      // if the senderOf the message is not online then return
      if (!onlineUsers.has(senderId)) {
        return;
      }

      io.to(senderId).emit('message:delivered', {
        messageId: msg._id,
        messageClientId: msg.clientId,
        conversationId: msg.conversationId,
        deliveredAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    // console.error('Failed to update delivered messages:', err);
  }
}
export default markMessagesAsDelivered;
