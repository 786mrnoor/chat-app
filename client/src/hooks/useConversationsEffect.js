import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';

import logger from '@/helpers/logger';

import {
  groupEvents,
  newConversationCreated,
  receiveMessage,
  setInitialConversations,
  updateLastMessage,
  updateUser,
} from '../store/chat-slice';

export default function useConversationEffect() {
  const socket = useSocket();
  const dispatch = useDispatch();
  // fetch initial conversations
  useEffect(() => {
    if (!socket) return;
    socket.emit('conversation:initial', (res) => {
      if (res.success) {
        dispatch(setInitialConversations(res.data));
      } else {
        console.error(res.message);
      }
    });
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;
    function onNewConversationCreated(newConversation) {
      dispatch(newConversationCreated(newConversation));
    }
    function onUserUpdated(data) {
      logger.log('user:updated', data);
      dispatch(updateUser(data));
    }
    function onMessageTyping({ userId, isTyping }) {
      dispatch(updateUser({ userId, isTyping }));
    }
    function onGroupCreated(group) {
      dispatch(newConversationCreated(group));
      logger.log('group:created\n', group);
    }
    function onGroupEvents(type, data) {
      logger.log('group:event\n', type, data);
      dispatch(groupEvents(data));
      dispatch(receiveMessage(data.message));
      dispatch(updateLastMessage(data.message));
    }

    socket.on('conversation:created', onNewConversationCreated);
    socket.on('user:details-updated', onUserUpdated);
    socket.on('user:typing', onMessageTyping);
    socket.on('group:created', onGroupCreated);
    socket.on('group:events', onGroupEvents);

    return () => {
      socket.off('conversation:created', onNewConversationCreated);
      socket.off('user:details-updated', onUserUpdated);
      socket.off('user:typing', onMessageTyping);
      socket.off('group:created', onGroupCreated);
      socket.off('group:events', onGroupEvents);
    };
  }, [socket, dispatch]);
}
