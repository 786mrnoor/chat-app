import express from 'express';

import userController from '../controllers/user-controller/index.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();
// '/api/users'
router
  .get('/search', authMiddleware, userController.searchUsers)
  .get('/check-email', userController.checkEmail);

export default router;
