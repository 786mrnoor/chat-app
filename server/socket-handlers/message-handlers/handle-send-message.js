import findIndividualExistingConversation from '../../helpers/find-individual-existing-conversation.js';
import ConversationModel from '../../models/conversation-model.js';
import MessageModel from '../../models/message-model.js';
import UserModel from '../../models/user-model.js';

async function handleSendMessage(io, socket, onlineUsers, data) {
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

  // console.log('Recipient ID:', recipientId);
  // console.log('Existing Conversation ID:', existingConversationId);

  const actualSenderId = socket.user?._id;
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
        // console.log('New individual conversation created:', conversation._id);

        // Notify both users that a new conversation has been created
        const user = await UserModel.findById(recipientId).select('-password -__v').lean().exec();
        const payload = conversation.toObject();
        payload.otherUser = user;
        delete payload?.members; // Remove members array
        io.to(actualSenderId.toString()).emit('conversation:created', { ...payload });

        // If recipient is online, notify them too
        if (onlineUsers.has(recipientId)) {
          payload.otherUser = socket?.user;
          io.to(recipientId).emit('conversation:created', payload);
        }
        // console.log('New conversation emitted');
      }
      currentConversationId = conversation._id;
    } else if (!currentConversationId && !recipientId) {
      // This case handles attempts to send message without recipientId or conversationId.
      // In a real app, groups would be created via a separate API call before messaging.
      // console.log(
      //   'No recipient ID or existing Conversation ID provided.',
      //   recipientId,
      //   currentConversationId
      // );

      socket.emit('messageError', 'Recipient ID or existing Conversation ID is required.');
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
    // console.log('Message saved to DB:', newMessage._id);

    // --- Update Conversation with last message info ---
    // This is important for displaying snippets in the chat list.
    await ConversationModel.findByIdAndUpdate(
      currentConversationId,
      {
        lastMessage: newMessage._id,
        lastMessageSender: newMessage.senderId,
        lastMessageTimestamp: newMessage.createdAt,
      },
      { runValidators: true, lean: true } // Return the updated document
    );

    // Emit the message to all clients in the conversation's room
    if (onlineUsers.has(recipientId)) {
      newMessage.deliveredAt = new Date();
      await newMessage.save();
      io.to(recipientId).emit('message:received', newMessage);
    }

    io.to(actualSenderId.toString()).emit('message:received', newMessage);
  } catch (error) {
    // console.error('Error in sendMessage:', error);
    socket.emit('messageError', 'Failed to send message: ' + error.message);
  }
}
export default handleSendMessage;
