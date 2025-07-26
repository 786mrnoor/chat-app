import express from 'express';

import conversationController from '../controllers/conversation-controller/index.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();
// '/api/conversation'
router.get('/', authMiddleware, conversationController.getConversations);

export default router;
