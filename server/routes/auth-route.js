import express from 'express';

import authController from '../controllers/auth-controller/index.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();

// '/api/auth'
router
  .post('/register', authController.register)
  .post('/login', authController.login)
  .post('/logout', authController.logout)
  .post('/forgot-password', authController.forgotPassword)
  .post('/reset-password/:token', authController.resetPassword)
  .get('/me', authMiddleware, authController.me);

export default router;
