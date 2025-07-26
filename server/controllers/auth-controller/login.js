import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../../models/user-model.js';

export default async function login(req, res) {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    // Check if email exists and match passwords
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: 'email is not found.' });
    }

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      return res.status(400).json({ error: true, message: 'password is not correct.' });
    }

    let payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      profileUrl: user.profileUrl,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
      sameSite: true,
    });

    res.status(200).json({ success: true, message: 'logged-in', token });

    // console.log(`[User logged-in]- name: ${user.name}, email: ${email}`);
  } catch (error) {
    // console.error('Registration error:', error);

    res.state(500).json({
      message: error.message || 'Server error during registration',
      error: true,
    });
  }
}
