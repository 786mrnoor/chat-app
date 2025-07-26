export function getConversation(conversations, id) {
  const conversation = conversations.find((con) => con._id === id || con.clientId === id);

  if (conversation === -1) return null;

  return conversation;
}
