import logger from '../../helpers/logger.js';
import ConversationModel from '../../models/conversation-model.js';
import UserModel from '../../models/user-model.js';

import markMessagesAsDelivered from './mark-messages-as-delivered.js';

async function userConnected(socket) {
  const onlineUsers = socket.onlineUsers;
  const userId = socket?.user?._id.toString();

  // join the socket to userId room
  socket.join(userId);
  // join socket to all the rooms that the user is a member of
  const groups = await ConversationModel.find({ members: userId, type: 'group' })
    .select('_id')
    .lean()
    .exec();

  groups?.forEach((group) => {
    socket.join(group?._id?.toString());
  });

  // If user is not yet in map, add them with a new Set

  let wasOffline = false;
  // Check if this is their first active socket
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
    wasOffline = true;
  }

  const userSockets = onlineUsers.get(userId);
  userSockets.add(socket.id); // Add the new socket ID to the user's set

  // If this is the user's first connection (i.e., they just came online)
  if (wasOffline) {
    logger.log(`[CONNECTED]- userId: ${userId} name: ${socket?.user?.name} socketId: ${socket.id}`);

    // Update user's online status in DB
    await UserModel.findByIdAndUpdate(
      userId,
      { isOnline: true, lastSeen: Date.now() },
      { lean: true, new: true, runValidators: true }
    ).catch((err) => logger.error('Error updating user online status:', err));

    // Broadcast this status update to all connected clients
    socket.broadcast.emit('user:details-updated', { userId, isOnline: true });
    markMessagesAsDelivered(socket.server, onlineUsers, socket.user?._id);
  } else {
    logger.log(
      `[CONNECTED]- userId: ${userId} name: ${socket?.user?.name} socketId: ${socket.id} from another device. Total connections: ${userSockets.size}`
    );
  }
}

export default userConnected;
