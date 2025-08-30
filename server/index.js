import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import connectDB from './config/connect-db.js';
import logger from './helpers/logger.js';
import socketAuthMiddleware from './middlewares/socket-auth-middleware.js';
import registerConvrsationHandlers from './socket-handlers/conversation-handlers/index.js';
import groupHandlers from './socket-handlers/group-handlers/index.js';
import registerMessageHandlers from './socket-handlers/message-handlers/index.js';
import registerUserHandlers from './socket-handlers/user-handlers/index.js';

const server = http.createServer(app);
const io = new Server(server);

//online user
const onlineUsers = new Map(); // <userId, Set<socketId>>

// authentication middleware
io.use(socketAuthMiddleware);

io.on('connection', async (socket) => {
  socket.onlineUsers = onlineUsers;

  // handle connection and disconnection of a user
  registerUserHandlers(socket);

  registerConvrsationHandlers(socket);

  registerMessageHandlers(socket);

  groupHandlers(socket);
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
});
