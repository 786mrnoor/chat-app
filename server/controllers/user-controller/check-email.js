import UserModel from '../../models/user-model.js';

async function checkEmail(req, res) {
  try {
    let { email } = req.query;
    email = email.toLowerCase();

    const user = await UserModel.findOne({ email }).select('name email profileUrl');

    if (!user) {
      return res.status(400).json({
        message: 'user not exit',
        error: true,
      });
    }

    return res.status(200).json({
      message: 'email verified successfully',
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
export default checkEmail;
