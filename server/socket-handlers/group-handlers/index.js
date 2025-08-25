import createGroup from './create-group.js';
import groupEvents from './group-events.js';

async function groupHandlers(socket) {
  socket.on('group:create', createGroup);
  socket.on('group:events', groupEvents);
}
export default groupHandlers;
