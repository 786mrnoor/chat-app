import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';

import {
  markAsDelivered,
  markAsRead,
  receiveMessage,
  updateLastMessage,
} from '../store/chat-slice';

export default function useMessagesEffect() {
  const socket = useSocket();
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
      dispatch(receiveMessage(newMessage));
      dispatch(updateLastMessage(newMessage));
    }
    function onMessageDelivered(data) {
      dispatch(markAsDelivered(data));
    }
    function onMessageRead(data) {
      dispatch(markAsRead(data));
    }

    socket.on('message:received', onMessageReceived);
    socket.on('message:delivered', onMessageDelivered);
    socket.on('message:read', onMessageRead);

    return () => {
      socket.off('message:received', onMessageReceived);
      socket.off('message:delivered', onMessageDelivered);
      socket.off('message:read', onMessageRead);
    };
  }, [socket, dispatch, activeConversationId, user?._id]);
}
