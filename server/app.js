import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth-route.js';
import cloudinarySignatureRouter from './routes/cloudinary-route.js';
import conversationRouter from './routes/conversation-route.js';
import userRouter from './routes/users-route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/users', userRouter);
app.use('/api/cloudinary', cloudinarySignatureRouter);

// React fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

export default app;
