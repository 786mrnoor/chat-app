import handleMessageRead from './handle-message-read.js';
import handleSendMessage from './handle-send-message.js';
import initialMessages from './initial-messages.js';

function messageHandlers(socket) {
  socket.on('message:send', handleSendMessage);
  socket.on('message:initial-messages', initialMessages);
  socket.on('message:read', handleMessageRead);
}
export default messageHandlers;
