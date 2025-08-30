import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../../models/user-model.js';

function verifyToken(token) {
  try {
    if (!token) return null;
    const decode = jwt.verify(token, process.env.JWT_RESET_SECRET_KEY);
    return decode;
  } catch (_error) {
    return null;
  }
}

export default async function resetPassword(req, res) {
  try {
    const { password } = req.body;
    const token = req.params.token;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await UserModel.findById(decodedToken._id).exec();

    if (!user) {
      return res.status(400).json({ message: 'Invalid user' });
    }
    if (user?.resetPasswordToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Server error during registration',
      error: true,
    });
  }
}
