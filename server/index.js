import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import connectDB from './config/connect-db.js';
import socketAuthMiddleware from './middlewares/socket-auth-middleware.js';
import registerMessageHandlers from './socket-handlers/message-handlers/index.js';
import registerUserHandlers from './socket-handlers/user-handlers/index.js';

const server = http.createServer(app);
const io = new Server(server);

//online user
const onlineUsers = new Map();

// authentication middleware
io.use(socketAuthMiddleware);

io.on('connection', async (socket) => {
  // handle connection and disconnection of a user
  registerUserHandlers(io, socket, onlineUsers);

  registerMessageHandlers(io, socket, onlineUsers);
});

// Make io globally available
app.set('io', io);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  server.listen(PORT, () => {
    // console.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
});
