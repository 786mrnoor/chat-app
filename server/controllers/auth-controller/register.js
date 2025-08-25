import bcrypt from 'bcryptjs';

import logger from '../../helpers/logger.js';
import UserModel from '../../models/user-model.js';

export default async function register(req, res) {
  try {
    let { name, email, password, profileUrl } = req.body;
    email = email.toLowerCase();

    // Check if user already exists
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    // Generate a salt(random string) with a cost factor of 10
    // Hash the password using the generated salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new UserModel({ name, email, password: hashedPassword, profileUrl });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });

    logger.log(`[User registered]- name: ${name}, email: ${email}`);
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message,
    });
  }
}
