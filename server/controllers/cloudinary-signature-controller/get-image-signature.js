import cloudinary from '../../config/cloudinary.js';

export default function getImageSignature(req, res) {
  try {
    const numberOfSignature = Number(req.query.n) || 1;

    const signedResponses = Array.from({ length: numberOfSignature }).map(() => {
      let timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          upload_preset: 'chat-images',
        },
        process.env.CLOUDINARY_API_SECRET
      );

      return {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY, // Send API Key (safe to expose)
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Send Cloud Name (safe to expose)
      };
    });

    res.json(signedResponses[0]);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message || error });
  }
}
