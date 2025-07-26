import handleMessageRead from './handle-message-read.js';
import handleSendMessage from './handle-send-message.js';
import initialMessages from './initial-messages.js';

function messageHandlers(io, socket, onlineUsers) {
  socket.on('message:send', (data) => handleSendMessage(io, socket, onlineUsers, data));
  socket.on('message:initial-messages', (conversationId, callback) =>
    initialMessages(io, socket, onlineUsers, conversationId, callback)
  );

  socket.on('message:read', (data) => handleMessageRead(socket, onlineUsers, data));
}
export default messageHandlers;
