import express from 'express';

import cloudinarySignatureController from '../controllers/cloudinary-signature-controller/index.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();
// '/api/cloudinary'
router.get('/image', authMiddleware, cloudinarySignatureController.getImageSignature);

export default router;
