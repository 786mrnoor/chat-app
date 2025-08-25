export function getConversation(conversations, id) {
  const conversation = conversations.find((con) => con._id === id || con.clientId === id);

  return conversation;
}
