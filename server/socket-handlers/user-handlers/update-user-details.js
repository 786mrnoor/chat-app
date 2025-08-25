import logger from '../../helpers/logger.js';
import UserModel from '../../models/user-model.js';

export default async function updateUserDetails(data, callback) {
  const user = this.user;
  try {
    // Update user
    let updateData = {};
    let updateFields = ['name', 'profileUrl', 'dateOfBirth', 'phoneNumber'];
    for (let key in data) {
      let value = data[key];
      if (updateFields.includes(key)) {
        updateData[key] = key === 'name' ? value.trim().toUpperCase() : value;
      }
    }
    await UserModel.findByIdAndUpdate(user?._id, updateData, { runValidators: true }).lean().exec();

    callback({ success: true, ...updateData });
    this.broadcast.emit('user:details-updated', {
      userId: user._id,
      ...updateData,
    });
  } catch (error) {
    logger.error('Error updating user details:', error);
    callback({ error: true, message: 'Failed to update user details' });
  }
}
