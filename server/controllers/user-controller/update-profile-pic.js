import fs from 'fs';
import multer from 'multer';

import cloudinary from '../../config/cloudinary.js';
import UserModel from '../../models/user-model.js';

// Multer: use memoryStorage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .png, .webp files are allowed'));
    }
  },
});

function updateProfilePic(req, res) {
  upload.single('profilePic')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Convert buffer to base64 data URI
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // Upload new image with compression + transformation
      const result = await cloudinary.uploader.upload(fileStr, {
        resource_type: 'image',
        upload_preset: 'profile-pics',
        invalidate: true,
        public_id: `user-${req.user._id}`, // consistent public_id for overwrite
      });

      // Update user
      await UserModel.updateOne({ _id: req.user._id }, { profileUrl: result.url });
      res.status(200).json({
        message: 'Profile picture updated',
        profileUrl: result.url,
        success: true,
      });

      const io = req.app.get('io');
      if (io) {
        io.emit('user:updated', {
          userId: req.user._id,
          profileUrl: result.url,
        });
      }
    } catch (err) {
      // console.error('Profile pic error:', err);
      res.status(500).json({ message: 'Upload failed' });
    }
  });
}
export default updateProfilePic;
