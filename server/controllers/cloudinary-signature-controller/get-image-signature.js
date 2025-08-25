import getCloudinarySignatureOptions from '../../config/cloudinary-signature.js';
import cloudinary from '../../config/cloudinary.js';
import logger from '../../helpers/logger.js';

export default function getImageSignature(req, res) {
  try {
    const { type, id } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Missing type' });
    } else if (type !== 'message-images' && !id) {
      return res.status(400).json({ error: 'Id is required' });
    }
    let options = getCloudinarySignatureOptions(type, id, req.user);
    if (!options) {
      return res.status(400).json({ error: 'Invalid type' });
    }
    // Generate a timestamp for the signature
    // Add timestamp to options
    options.timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(options, process.env.CLOUDINARY_API_SECRET);

    res.json({
      signature,
      api_key: process.env.CLOUDINARY_API_KEY, // Send API Key (safe to expose)
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Send Cloud Name (safe to expose)
      ...options,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message || error });
  }
}
