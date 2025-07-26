import jwt from 'jsonwebtoken';

import UserModel from '../models/user-model.js';

async function verifySession(token) {
  if (!token) {
    return null;
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decode._id)
      .select('-password -createdAt -updatedAt -__v')
      .lean()
      .exec();

    return user;
  } catch (error) {
    // console.error('some error occurred while verifying session\n', error);
    return null;
  }
}
export default verifySession;
