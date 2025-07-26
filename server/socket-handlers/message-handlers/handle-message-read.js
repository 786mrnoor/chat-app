import MessageModel from '../../models/message-model.js';

async function markMessageAsRead(socket, onlineUsers, { messageId, conversationId }) {
  const message = await MessageModel.findOneAndUpdate(
    { _id: messageId, conversationId },
    { $set: { readAt: new Date() } },
    { new: true, runValidators: true }
  )
    .select('senderId readAt')
    .lean()
    .exec();

  // to sender and receiver
  let messageSender = message.senderId.toString();
  let payload = { messageId, conversationId, readAt: message.readAt };
  if (onlineUsers.has(messageSender)) {
    socket.to(messageSender).emit('message:read', payload);
  }
  socket.to(socket.user?._id?.toString()).emit('message:read', payload);
}

export default markMessageAsRead;
