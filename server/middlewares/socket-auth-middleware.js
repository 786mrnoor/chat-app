import cookieParser from 'cookie-parser';

import verifySession from '../helpers/verify-session.js';

function authorizationError() {
  let error = new Error('not authorized');
  error.data = { status: 401 };
  return error;
}
async function socketAuthMiddleware(socket, next) {
  const req = socket.request;

  cookieParser()(req, null, async (err) => {
    if (err) return next(err);

    const token = req.cookies?.token;
    if (!token) return next(authorizationError());

    try {
      const user = await verifySession(token);
      if (!user) {
        return next(authorizationError());
      }

      socket.user = user; // Store user data in socket
      return next();
    } catch (error) {
      return next(authorizationError());
    }
  });
}

export default socketAuthMiddleware;
