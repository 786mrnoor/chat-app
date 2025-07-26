import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchConversations } from '@/store/conversations';

import { useSocket } from '../contexts/SocketContext';
import { newConversationCreated, updateUser } from '../store/chat-slice';

export default function useConversationEffect() {
  const socket = useSocket();
  const dispatch = useDispatch();
  // fetch initial conversations
  useEffect(() => {
    if (!socket) return;
    dispatch(fetchConversations());
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;
    function onNewConversationCreated(newConversation) {
      dispatch(newConversationCreated(newConversation));
    }
    function onUserUpdated(data) {
      dispatch(updateUser(data));
    }

    socket.on('conversation:created', onNewConversationCreated);
    socket.on('user:updated', onUserUpdated);

    return () => {
      socket.off('conversation:created', onNewConversationCreated);
      socket.off('user:updated', onUserUpdated);
    };
  }, [socket, dispatch]);
}
