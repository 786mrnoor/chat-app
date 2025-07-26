import MessageModel from '../../models/message-model.js';

async function initialMessages(io, socket, onlineUsers, conversationId, callback) {
  if (!conversationId) {
    callback({ error: 'Conversation ID is required.' });
    return;
  }
  try {
    // mark the unread messages as read
    const userId = socket.user?._id;

    const unseenMessages = await MessageModel.find({
      conversationId,
      readAt: null,
      senderId: { $ne: userId },
    })
      .select('_id senderId conversationId readAt')
      .exec();

    const messageIds = unseenMessages.map((msg) => msg._id);
    await MessageModel.updateMany({ _id: { $in: messageIds } }, { $set: { readAt: new Date() } });

    unseenMessages.forEach((msg) => {
      let payload = {
        messageId: msg._id,
        conversationId: conversationId,
        readAt: new Date().toISOString(),
        senderId: msg.senderId,
      };
      socket.to(userId.toString()).emit('message:read', payload);

      const senderId = msg.senderId.toString();
      if (onlineUsers.has(senderId)) {
        io.to(senderId).emit('message:read', payload);
      }
    });

    // get all the messages
    const messages = await MessageModel.find({ conversationId })
      .sort({ createdAt: -1 })
      // .limit(10) // Fetch last 30 messages
      .lean()
      .exec();

    callback(messages);
  } catch (error) {
    // console.error('Error fetching initial messages:', error);
    callback({
      error: 'Failed to fetch messages: ' + error.message,
    });
  }
}

export default initialMessages;
