import axios from 'axios';
import { useDispatch } from 'react-redux';

import { useSocket } from '@/features/socket/SocketContext';
import useOptimisticMessageCreater from '@/hooks/useOptimisticMessageCreater';

import reduceImage from '@/helpers/reduce-image';
import { getSignatureWithFormData } from '@/lib/cloudinary';
import {
  sendMessage,
  updateLastMessageOfConversation,
  updateMessageFields,
} from '@/store/chat-slice';

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
        optimisticMessage.media.status = 'uploading';
        optimisticMessage.media.progress = 0;

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
        let uploadError;
        const response = await axios
          .post(uploadUrl, formData, {
            onUploadProgress(progressEvent) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              let isUploaded = percentCompleted === 100;
              dispatch(
                updateMessageFields({
                  clientId: optimisticMessage.clientId,
                  media: {
                    progress: isUploaded ? null : percentCompleted,
                    status: isUploaded ? null : 'uploading',
                  },
                })
              );
            },
          })
          .catch((error) => {
            dispatch(
              updateMessageFields({
                clientId: optimisticMessage.clientId,
                media: {
                  status: 'failed',
                  progress: null,
                },
              })
            );
            uploadError = error;
            console.error(
              `Error uploading ${optimisticMessage.content || optimisticMessage.clientId}:`,
              error.response ? error.response.data : error.message
            );
          });

        if (uploadError || !socketConnection) return;
        const data = response?.data;
        socketConnection.emit('message:send', {
          ...optimisticMessage,
          media: {
            url: data.secure_url,
            width: data.width,
            height: data.height,
            publicId: data.public_id,
          },
        });
      });
    } catch (error) {
      console.error(error.message || 'Overall upload process failed:');
    }
  }
  return sendAttachments;
}
