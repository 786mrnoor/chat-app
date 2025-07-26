import UserModel from '../../models/user-model.js';

async function userConnected(io, socket, onlineUsers) {
  // --- NEW: Add socket to onlineUsers map ---
  // If user is not yet in map, add them with a new Set
  const userId = socket?.user?._id.toString();

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  socket.join(userId);

  const userSockets = onlineUsers.get(userId);
  const wasOffline = userSockets.size === 0; // Check if this is their first active socket
  userSockets.add(socket.id); // Add the new socket ID to the user's set

  // If this is the user's first connection (i.e., they just came online)
  if (wasOffline) {
    // console.log(
    //   `[CONNECTED]- userId: ${userId} name: ${socket?.user?.name} socketId: ${socket.id}`
    // );
    // Update user's online status in DB
    await UserModel.findByIdAndUpdate(
      userId,
      { isOnline: true, lastSeen: Date.now() },
      { lean: true, new: true, runValidators: true }
    ).catch((err) => console.error('Error updating user online status:', err));

    // Broadcast this status update to all connected clients
    io.except(userId).emit('user:updated', { userId, isOnline: true });
  } else {
    // console.log(
    //   `[CONNECTED]- userId: ${userId} name: ${socket?.user?.name} socketId: ${socket.id} from another device. Total connections: ${userSockets.size}`
    // );
  }
}

export default userConnected;
