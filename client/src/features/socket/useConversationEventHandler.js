import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import logger from '@/helpers/logger';
import {
  addConversation,
  addMessage,
  groupEvents,
  setInitialConversations,
  updateLastMessageOfConversation,
  updateUser,
} from '@/store/chat-slice';

export default function useConversationEventHandler(socket) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // fetch initial conversations
  useEffect(() => {
    if (!socket) return;
    socket.emit('conversation:initial', (res) => {
      if (res.success) {
        logger.log('conversation:initial', res.data);
        dispatch(setInitialConversations(res.data));
      } else {
        console.error(res.message);
      }
    });
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;
    function onNewConversationCreated(newConversation) {
      logger.log('conversation:created', newConversation);
      dispatch(addConversation(newConversation));
    }
    function onUserUpdated(data) {
      logger.log('user:updated', data);
      dispatch(updateUser(data));
    }
    function onMessageTyping({ userId, isTyping }) {
      logger.log('user:typing', userId, isTyping);
      dispatch(updateUser({ userId, isTyping }));
    }
    function onGroupCreated(group) {
      group.members = group.members.filter((m) => m._id !== user?._id);
      logger.log('group:created\n', group);
      dispatch(addConversation(group));
    }
    function onGroupEvents(type, data) {
      logger.log('group:event\n', type, data);
      dispatch(groupEvents(data));
      dispatch(addMessage(data.message));
      dispatch(updateLastMessageOfConversation(data.message));
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
