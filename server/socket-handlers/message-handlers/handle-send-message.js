import findOrCreateConversation from '../../helpers/find-or-create-conversation.js';
import logger from '../../helpers/logger.js';
import ConversationModel from '../../models/conversation-model.js';
import MessageModel from '../../models/message-model.js';
import UserModel from '../../models/user-model.js';

async function handleSendMessage(data) {
  const onlineUsers = this.onlineUsers;
  // async (data) => {
  let {
    type = 'text', // Default message type
    clientId,
    content,
    media,
    recipientId,
    conversationId,
    conversationClientId,
  } = data;

  const actualSenderId = this.user?._id;
  let currentConversation;

  try {
    // Case 1: Starting a NEW 1-on-1 chat
    if (!conversationId && recipientId) {
      let [conversation, recipient] = await findOrCreateConversation(
        actualSenderId,
        recipientId,
        conversationClientId
      );
      if (recipient) {
        // Notify both users that a new conversation has been created
        const payload = conversation.toObject();
        payload.otherUser = recipient;
        delete payload?.members; // Remove members array
        this.server.to(actualSenderId.toString()).emit('conversation:created', { ...payload });

        // If recipient is online, notify them too
        if (onlineUsers.has(recipientId)) {
          payload.otherUser = this.user;
          this.to(recipientId).emit('conversation:created', payload);
        }
      }
      currentConversation = conversation;
    } else if (!conversationId && !recipientId) {
      // This case handles attempts to send message without recipientId or conversationId.
      // In a real app, groups would be created via a separate API call before messaging.
      logger.log(
        'No recipient ID or existing Conversation ID provided.',
        recipientId,
        conversationId
      );

      this.emit('messageError', 'Recipient ID or existing Conversation ID is required.');
      return;
    }

    // check if the conversation exists
    if (!currentConversation) {
      currentConversation = await ConversationModel.findOne({
        _id: conversationId,
        members: actualSenderId,
      }).exec();
    }
    // Create new Message document
    const newMessage = new MessageModel({
      type,
      clientId,
      content,
      media,
      conversationId: currentConversation?._id, // required
      senderId: actualSenderId,
    });

    await newMessage.save();

    currentConversation.lastMessage = newMessage._id;
    currentConversation.lastMessageSender = newMessage.senderId;
    currentConversation.lastMessageTimestamp = newMessage.createdAt;
    await currentConversation.save();

    let deliveredTo;
    // check if recipient is online
    if (recipientId && onlineUsers.has(recipientId)) {
      deliveredTo = recipientId;
    }
    // check if one of the members is online other than the sender
    else if (currentConversation.type === 'group') {
      // emit to all users in the
      const isAMemberOnline = currentConversation.members.some(
        (m) => m.toString() !== actualSenderId.toString() && onlineUsers.has(m.toString())
      );

      if (isAMemberOnline) {
        deliveredTo = currentConversation?._id?.toString();
      }
    }

    if (deliveredTo) {
      newMessage.deliveredAt = new Date();
      await newMessage.save();
    }

    this.server.to(actualSenderId.toString()).to(deliveredTo).emit('message:received', newMessage);
  } catch (error) {
    logger.error('Error in sendMessage:', error);
    this.emit('messageError', 'Failed to send message: ' + error.message);
  }
}
export default handleSendMessage;
