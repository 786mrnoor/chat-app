import logger from '../../helpers/logger.js';

export default function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully', success: true });

  logger.log('[User logged-out]');
}
