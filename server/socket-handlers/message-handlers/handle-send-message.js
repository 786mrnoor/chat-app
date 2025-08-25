import findIndividualExistingConversation from '../../helpers/find-individual-existing-conversation.js';
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
    conversationId: existingConversationId,
    conversationClientId,
  } = data;

  const actualSenderId = this.user?._id;
  let currentConversationId = existingConversationId;

  try {
    // Case 1: Starting a NEW 1-on-1 chat
    if (!currentConversationId && recipientId) {
      // Try to find an existing individual conversation between these two users
      let [conversation, membersSorted] = await findIndividualExistingConversation(
        actualSenderId,
        recipientId
      );

      // If no conversation found, create a new one
      if (!conversation) {
        conversation = new ConversationModel({
          type: 'individual',
          clientId: conversationClientId,
          members: membersSorted,
          createdBy: actualSenderId, // The user who initiated it
        });
        await conversation.save();

        // Notify both users that a new conversation has been created
        const user = await UserModel.findById(recipientId)
          .select('name email profileUrl isOnline lastSeen')
          .lean()
          .exec();
        const payload = conversation.toObject();
        payload.otherUser = user;
        delete payload?.members; // Remove members array
        this.server.to(actualSenderId.toString()).emit('conversation:created', { ...payload });

        // If recipient is online, notify them too
        if (onlineUsers.has(recipientId)) {
          payload.otherUser = this.user;
          this.to(recipientId).emit('conversation:created', payload);
        }
      }
      currentConversationId = conversation._id;
    } else if (!currentConversationId && !recipientId) {
      // This case handles attempts to send message without recipientId or conversationId.
      // In a real app, groups would be created via a separate API call before messaging.
      logger.log(
        'No recipient ID or existing Conversation ID provided.',
        recipientId,
        currentConversationId
      );

      this.emit('messageError', 'Recipient ID or existing Conversation ID is required.');
      return;
    }

    // Create new Message document
    const newMessage = new MessageModel({
      type,
      clientId,
      content,
      media,
      conversationId: currentConversationId,
      senderId: actualSenderId,
    });

    await newMessage.save();

    // --- Update Conversation with last message info ---
    // This is important for displaying snippets in the chat list.
    const conversation = await ConversationModel.findByIdAndUpdate(
      currentConversationId,
      {
        lastMessage: newMessage._id,
        lastMessageSender: newMessage.senderId,
        lastMessageTimestamp: newMessage.createdAt,
      },
      { runValidators: true, lean: true } // Return the updated document
    ).exec();

    let deliveredTo;
    // check if recipient is online
    if (recipientId && onlineUsers.has(recipientId)) {
      deliveredTo = recipientId;
    }
    // check if one of the members is online other than the sender
    else if (conversation.type === 'group') {
      // emit to all users in the group
      const sockets = await this.server.in(currentConversationId.toString()).fetchSockets();
      const isAMemberOnline = sockets.some(
        (socket) => socket.user?._id.toString() !== actualSenderId.toString()
      );

      if (isAMemberOnline) {
        deliveredTo = currentConversationId.toString();
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
