import verifySession from '../helpers/verify-session.js';

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const user = await verifySession(token);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    } else {
      req.user = user; // Attach user payload to request
      next();
    }
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

export default authMiddleware;
