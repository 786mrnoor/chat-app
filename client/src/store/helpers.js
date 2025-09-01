export function getConversation(conversations, { id, clientId, otherUserId }) {
  const conversation = conversations.find((con) =>
    isSameConversation(con, { id, clientId, otherUserId })
  );

  return conversation;
}

export function isSameConversation(conversation, { id, clientId, otherUserId }) {
  return (
    (conversation._id && conversation._id === id) ||
    (conversation.clientId && conversation.clientId === clientId) ||
    (otherUserId &&
      conversation.type === 'individual' &&
      conversation.otherUser._id === otherUserId)
  );
}
