import axios from 'axios';

export default function uploadChatImage(
  reducedFile,
  { signature, timestamp, api_key, cloud_name },
  onUploadProgress
) {
  const formData = new FormData();
  formData.append('file', reducedFile);
  formData.append('api_key', api_key);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('upload_preset', 'chat-images');

  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
  const response = axios.post(cloudinaryUploadUrl, formData, {
    onUploadProgress,
  });

  return response; // Return the response data for further processing if needed
}
