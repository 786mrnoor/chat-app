import handleUserTyping from './handle-user-typing.js';
import updateUserDetails from './update-user-details.js';
import userConnected from './user-connected.js';
import userDisconnected from './user-disconnected.js';

function userHandlers(socket) {
  userConnected(socket);

  socket.on('user:update-details', updateUserDetails);
  socket.on('user:typing', handleUserTyping);
  socket.on('disconnect', userDisconnected);
}
export default userHandlers;
