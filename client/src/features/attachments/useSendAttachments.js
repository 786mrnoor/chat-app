import axios from 'axios';
import { useDispatch } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';
import useOptimisticMessageCreater from '@/hooks/useOptimisticMessageCreater';

import preloadImage from '@/helpers/preload-image';
import reduceImage from '@/helpers/reduce-image';
import { getSignatureWithFormData } from '@/lib/cloudinary';
import { sendMessage, updateLastMessage } from '@/store/chat-slice';

export default function useSendAttachments() {
  const dispatch = useDispatch();
  const createOptimisticMessage = useOptimisticMessageCreater();
  const socketConnection = useSocket();

  //type: 'image'
  async function sendAttachments(messages, type) {
    try {
      const optimisticMessagesPromise = messages.map(async (message) => {
        const reducedFile = await reduceImage(message.media?.url, {
          type: message.media?.type,
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.6,
        });
        URL.revokeObjectURL(message.media?.url);

        const optimisticMessage = createOptimisticMessage(type, message.content, {
          url: URL.createObjectURL(reducedFile),
        });

        dispatch(sendMessage(optimisticMessage));
        dispatch(updateLastMessage(optimisticMessage));

        return [optimisticMessage, reducedFile];
      });

      const optimisticMessages = await Promise.all(optimisticMessagesPromise);

      //get the signature from server
      const [formData, uploadUrl] = await getSignatureWithFormData('message-image');

      optimisticMessages.map(async ([optimisticMessage, reducedFile]) => {
        formData.delete('file');
        formData.append('file', reducedFile);

        //upload the file to the cloudinary
        const { data: response } = await axios.post(uploadUrl, formData).catch((error) => {
          console.error(
            `Error uploading ${optimisticMessage.name}:`,
            error.response ? error.response.data : error.message
          );
        });

        await preloadImage(response.secure_url).catch((error) => {
          console.error('Error preloading image:', error);
        });

        if (!socketConnection) return;
        socketConnection.emit('message:send', {
          ...optimisticMessage,
          media: {
            url: response.secure_url,
            width: response.width,
            height: response.height,
            publicId: response.public_id,
          },
        });
      });
    } catch (error) {
      console.error(error.message || 'Overall upload process failed:');
    }
  }
  return sendAttachments;
}
