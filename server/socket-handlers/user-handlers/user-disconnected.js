import logger from '../../helpers/logger.js';
import UserModel from '../../models/user-model.js';

async function userDisconnected() {
  const userId = this.user?._id.toString();
  const onlineUsers = this.onlineUsers;
  //Get the set of sockets for this user
  const userSockets = onlineUsers.get(userId);

  if (userSockets) {
    userSockets.delete(this.id); // Remove the disconnected socket ID

    // If the user's set of sockets is now empty, it means they are fully offline
    if (userSockets.size === 0) {
      onlineUsers.delete(userId); // Remove user from the map if no active sockets
      logger.log(
        `[DISCONNECTED]- userId: ${userId} name: ${this.user?.name} socketId: ${this.id} is now OFFLINE (all devices disconnected).`
      );
      // Update user's online status in DB
      await UserModel.findByIdAndUpdate(
        userId,
        { isOnline: false, lastSeen: Date.now() },
        { lean: true, new: true, runValidators: true }
      ).catch((err) => logger.error('Error updating user offline status:', err));

      // Broadcast status update
      this.broadcast.emit('user:details-updated', { userId, isOnline: false });
    } else {
      logger.log(
        `[DISCONNECTED]- userId: ${userId} name: ${this?.user?.name} socketId: ${this.id} still has ${userSockets.size} active connections.`
      );
    }
  }
}

export default userDisconnected;
