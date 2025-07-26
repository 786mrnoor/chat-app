import UserModel from '../../models/user-model.js';

async function searchUsers(request, response) {
  try {
    const { name } = request.query;

    const query = new RegExp(name, 'i', 'g');

    const user = await UserModel.find({
      $and: [
        { _id: { $ne: request.user._id } }, // Exclude the current user
        {
          $or: [{ name: query }, { email: query }],
        },
      ],
    }).select('-password');

    return response.json({
      message: 'all user',
      data: user,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
export default searchUsers;
