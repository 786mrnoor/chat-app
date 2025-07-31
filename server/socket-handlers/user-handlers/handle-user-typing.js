async function handleUserTyping(io, onlineUsers, { userId, otherUserId, isTyping }) {
  //userId is the one who is typing
  // otherUser is the one being typed to
  if (onlineUsers.has(otherUserId)) {
    io.to(otherUserId).emit('user:typing', { userId, isTyping });
  }
}

export default handleUserTyping;
