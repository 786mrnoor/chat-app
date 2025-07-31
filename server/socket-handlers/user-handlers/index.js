import handleUserTyping from './handle-user-typing.js';
import markMessagesAsDelivered from './mark-messages-as-delivered.js';
import userConnected from './user-connected.js';
import userDisconnected from './user-disconnected.js';

function userHandlers(io, socket, onlineUsers) {
  userConnected(io, socket, onlineUsers);

  markMessagesAsDelivered(io, onlineUsers, socket.user?._id);

  socket.on('user:typing', (data) => handleUserTyping(io, onlineUsers, data));
  socket.on('disconnect', () => userDisconnected(io, socket, onlineUsers));
}
export default userHandlers;
