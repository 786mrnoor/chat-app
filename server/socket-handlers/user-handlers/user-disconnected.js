import UserModel from '../../models/user-model.js';

async function userDisconnected(io, socket, onlineUsers) {
  const userId = socket?.user?._id.toString();
  //Get the set of sockets for this user
  const userSockets = onlineUsers.get(userId);

  if (userSockets) {
    userSockets.delete(socket.id); // Remove the disconnected socket ID

    // If the user's set of sockets is now empty, it means they are fully offline
    if (userSockets.size === 0) {
      onlineUsers.delete(userId); // Remove user from the map if no active sockets
      // console.log(
      //   `[DISCONNECTED]- userId: ${userId} name: ${socket?.user?.name} socketId: ${socket.id} is now OFFLINE (all devices disconnected).`
      // );
      // Update user's online status in DB
      await UserModel.findByIdAndUpdate(
        userId,
        { isOnline: false, lastSeen: Date.now() },
        { lean: true, new: true, runValidators: true }
      ).catch((err) => console.error('Error updating user offline status:', err));

      // Broadcast status update
      io.except(userId).emit('user:updated', { userId, isOnline: false });
    } else {
      // console.log(
      //   `[DISCONNECTED]- userId: ${userId} name: ${socket?.user?.name} socketId: ${socket.id} still has ${userSockets.size} active connections.`
      // );
    }
  }
}

export default userDisconnected;
