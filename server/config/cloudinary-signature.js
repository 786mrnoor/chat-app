let CLOUDINARY_PRESET_NAME = process.env.CLOUDINARY_PRESET_NAME || 'chat-app';
const CHAT_AVATAR_OPTIONS = {
  overwrite: true,
  invalidate: true,
  upload_preset: CLOUDINARY_PRESET_NAME,
  transformation: 'w_300,h_300,c_lfill,g_face/q_auto,f_auto',
  // transformation: [
  //   { width: 300, height: 300, crop: 'lfill', gravity: 'face' },
  //   { quality: 'auto', fetch_format: 'auto' },
  // ],
};

const MESSAGE_IMAGE_OPTIONS = {
  upload_preset: CLOUDINARY_PRESET_NAME,
  type: 'upload',
  folder: `${CLOUDINARY_PRESET_NAME}/messages/images`,
};
const MESSAGE_VIDEO_OPTIONS = {
  upload_preset: CLOUDINARY_PRESET_NAME,
  type: 'upload',
  folder: `${CLOUDINARY_PRESET_NAME}/messages/videos`,
  transformation: 'c_limit,w_720,h_720,q_auto,f_auto',
};

export default function getCloudinarySignatureOptions(type, id, user) {
  let options;
  switch (type) {
    case 'user-avatar': {
      options = { ...CHAT_AVATAR_OPTIONS };
      options.public_id = `user-${user?._id}`; // Use user ID for public_id
      options.folder = `${CLOUDINARY_PRESET_NAME}/avatars/users`; // Set folder for user avatars
      options.display_name = user?.name; // Set folder for user avatars
      break;
    }
    case 'group-avatar': {
      options = { ...CHAT_AVATAR_OPTIONS };
      options.public_id = `group-${id}`; // Use user ID for public_id
      options.folder = `${CLOUDINARY_PRESET_NAME}/avatars/groups`; // Set folder for group avatars
      break;
    }
    case 'message-image':
      options = { ...MESSAGE_IMAGE_OPTIONS };
      break;
    case 'message-video':
      options = { ...MESSAGE_VIDEO_OPTIONS };
      break;
  }

  return options;
}
