import axios from 'axios';
import { useDispatch } from 'react-redux';

import { useSocket } from '@/features/socket/SocketContext';
import useOptimisticMessageCreater from '@/hooks/useOptimisticMessageCreater';

import preloadImage from '@/helpers/preload-image';
import reduceImage from '@/helpers/reduce-image';
import { getSignatureWithFormData } from '@/lib/cloudinary';
import { sendMessage, updateLastMessageOfConversation } from '@/store/chat-slice';

export default function useSendAttachments() {
  const dispatch = useDispatch();
  const createOptimisticMessage = useOptimisticMessageCreater();
  const socketConnection = useSocket();

  //type: 'image' || 'video'
  async function sendAttachments(messages, type) {
    try {
      // replace the file with the reduced file
      if (type === 'image') {
        // message[].file = reduceImage
        const optimisticMessagesPromise = messages.map(async (message) => {
          const reducedFile = await reduceImage(message.media?.url, {
            type: message.media?.type,
            maxWidth: 1000,
            maxHeight: 1000,
            quality: 0.6,
          });
          URL.revokeObjectURL(message.media?.url);
          message.file = reducedFile;
        });

        await Promise.all(optimisticMessagesPromise);
      }
      const optimisticMessages = messages.map((message) => {
        const optimisticMessage = createOptimisticMessage(type, message.content, {
          url: URL.createObjectURL(message.file),
        });

        dispatch(sendMessage(optimisticMessage));
        dispatch(updateLastMessageOfConversation(optimisticMessage));

        return [optimisticMessage, message.file];
      });

      //get the signature from server
      let signatureType = type === 'image' ? 'message-image' : 'message-video';
      const [formData, uploadUrl] = await getSignatureWithFormData(signatureType);

      optimisticMessages.map(async ([optimisticMessage, file]) => {
        formData.delete('file');
        formData.append('file', file);

        //upload the file to the cloudinary
        const { data: response } = await axios.post(uploadUrl, formData).catch((error) => {
          console.error(
            `Error uploading ${optimisticMessage.name}:`,
            error.response ? error.response.data : error.message
          );
        });

        if (type === 'image') {
          await preloadImage(response.secure_url).catch((error) => {
            console.error('Error preloading image:', error);
          });
        }

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
