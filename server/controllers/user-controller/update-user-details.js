// const getUserDetailsFromToken = require("../../helpers/getUserDetailsFromToken")
import UserModel from '../../models/user-model.js';

async function updateUserDetails(req, res) {
  try {
    let { name } = req.body;
    name = name.toUpperCase();
    let userId = req.user._id;

    // Update user
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { name },
      { new: true, runValidators: true, lean: true, fields: '-password -__v' }
    ).exec();

    res.status(200).json({
      message: 'Profile details updated successfully',
      user,
      success: true,
    });

    const io = req.app.get('io');
    if (io) {
      io.except(userId).emit('user:updated', {
        userId,
        name,
      });
    }
  } catch (err) {
    // console.error('Profile pic error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
}
export default updateUserDetails;
