import ConversationModel from '../models/conversation-model.js';
import UserModel from '../models/user-model.js';

export default async function findOrCreateConversation(senderId, recipientId, clientId) {
  // Try to find an existing individual conversation between these two users
  // and if not found create a new one
  let recipient;
  let conversationKey = [senderId, recipientId].sort().join('_');

  let conversation = await ConversationModel.findOne({
    type: 'individual',
    conversationKey,
  });

  if (!conversation) {
    recipient = await UserModel.findById(recipientId)
      .select('name email profileUrl isOnline lastSeen')
      .lean()
      .exec();
    if (!recipient) throw new Error('Recipient not found');

    conversation = new ConversationModel({
      type: 'individual',
      conversationKey,
      clientId,
      members: [senderId, recipientId],
    });
    await conversation.save();
  }

  return [conversation, recipient];
}
