import MessageModel from '../../models/message-model.js';

async function markMessageAsRead({ messageId, conversationId }) {
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
  let deliveredTo = [this.user?._id?.toString()];
  if (this.onlineUsers.has(messageSender)) {
    deliveredTo.push(messageSender);
  }

  this.to(deliveredTo).emit('message:read', payload);
}

export default markMessageAsRead;
