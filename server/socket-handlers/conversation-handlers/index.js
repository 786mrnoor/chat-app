import initialConversations from './initial-conversations.js';

export default function registerConvrsationHandlers(socket) {
  socket.on('conversation:initial', initialConversations);
}
