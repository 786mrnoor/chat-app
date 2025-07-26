import { useDispatch } from 'react-redux';

// import { createOptimisticMessage } from '@/store/messages';

import { useSocket } from '@/contexts/SocketContext';
import preloadImage from '@/helpers/preload-image';
import reduceImage from '@/helpers/reduce-image';
import authAxios from '@/lib/auth-axios';
import uploadChatImage from '@/lib/cloudinary';
import { sendMessage, updateLastMessage } from '@/store/chat-slice';

import useOptimisticMessageCreater from './useOptimisticMessageCreater';

export default function useSendAttachments() {
  const dispatch = useDispatch();
  const createOptimisticMessage = useOptimisticMessageCreater();
  const socketConnection = useSocket();

  async function sendAttachments(messages, type) {
    try {
      const optimisticMessagesPromise = messages.map(async (message) => {
        const {
          file: reducedFile,
          width,
          height,
        } = await reduceImage(message.media?.url, message.media?.type);
        URL.revokeObjectURL(message.media?.url);

        const optimisticMessage = createOptimisticMessage(type, message.content, {
          url: URL.createObjectURL(reducedFile),
          width,
          height,
        });

        dispatch(sendMessage(optimisticMessage));
        dispatch(updateLastMessage(optimisticMessage));

        return [optimisticMessage, reducedFile];
      });

      const optimisticMessages = await Promise.all(optimisticMessagesPromise);

      //get the signature from server
      const { data: signatureResponse } = await authAxios.get(`/api/cloudinary/signature/image`);

      optimisticMessages.map(async ([optimisticMessage, reducedFile]) => {
        try {
          //upload the file to the cloudinary
          const { data: response } = await uploadChatImage(
            reducedFile,
            signatureResponse
            // (progressEvent) => {
            //   // You can update individual file progress here if you want granular feedback

            //   const percentCompleted = Math.round(
            //     (progressEvent.loaded * 100) / progressEvent.total
            //   );
            //   // console.log(`Uploading ${optimisticMessage.content}: ${percentCompleted}%`);
            // }
          );

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
        } catch (uploadError) {
          console.error(
            `Error uploading ${optimisticMessage.name}:`,
            uploadError.response ? uploadError.response.data : uploadError.message
          );
        }
      });
    } catch (err) {
      console.error('Overall upload process failed:', err);
      // setError(err.response ? err.response.data.error.message : err.message);
    }
  }
  return sendAttachments;
}
