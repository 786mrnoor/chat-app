async function handleUserTyping({ userId, otherUserId, isTyping }) {
  //userId is the one who is typing
  // otherUser is the one being typed to
  if (this.onlineUsers.has(otherUserId)) {
    this.to(otherUserId).emit('user:typing', { userId, isTyping });
  }
}

export default handleUserTyping;
