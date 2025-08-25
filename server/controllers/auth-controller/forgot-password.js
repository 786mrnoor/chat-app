import jwt from 'jsonwebtoken';

import logger from '../../helpers/logger.js';
import sendForgotPasswordEmail from '../../helpers/sendForgotPasswordEmail.js';
import UserModel from '../../models/user-model.js';

export default async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(400).json({ erro: true, message: 'No user found with this email' });

    const token = jwt.sign({ _id: user._id, time: Date.now() }, process.env.JWT_RESET_SECRET_KEY, {
      expiresIn: '15m',
    });

    user.resetPasswordToken = token;
    await user.save();

    await sendForgotPasswordEmail(email, user.name, token);

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'Server error during registration',
      error: true,
    });
  }
}
