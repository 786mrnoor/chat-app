import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import logger from '@/helpers/logger';
import {
  addMessage,
  markAsDelivered,
  markAsRead,
  updateLastMessageOfConversation,
} from '@/store/chat-slice';

export default function useMessagesEventHandler(socket) {
  const activeConversationId = useSelector((state) => state.activeConversationId);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // listen to new messages
  useEffect(() => {
    if (!socket) return;
    function onMessageReceived(newMessage) {
      // if it is recipient and the message is for the active conversation, mark it read
      if (newMessage.senderId !== user?._id && newMessage.conversationId === activeConversationId) {
        socket.emit('message:read', {
          messageId: newMessage._id,
          conversationId: newMessage.conversationId,
        });
      }
      logger.log('message:received', newMessage);
      dispatch(addMessage(newMessage));
      dispatch(updateLastMessageOfConversation(newMessage));
    }
    function onMessageDelivered(data) {
      logger.log('message:delivered', data);
      dispatch(markAsDelivered(data));
    }
    function onMessageRead(data) {
      logger.log('message:read', data);
      dispatch(markAsRead(data));
    }

    function onMessageError(messageClientId, errorMessage) {
      console.error(messageClientId, errorMessage);
    }

    socket.on('message:received', onMessageReceived);
    socket.on('message:delivered', onMessageDelivered);
    socket.on('message:read', onMessageRead);
    socket.on('message:error', onMessageError);

    return () => {
      socket.off('message:received', onMessageReceived);
      socket.off('message:delivered', onMessageDelivered);
      socket.off('message:read', onMessageRead);
      socket.off('message:error', onMessageError);
    };
  }, [socket, dispatch, activeConversationId, user?._id]);
}
