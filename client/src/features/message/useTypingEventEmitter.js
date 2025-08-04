import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';

import useActiveConversation from './useActiveConversation';

export default function useTypingHandler() {
  const typingTimeoutRef = useRef(null);
  const socketConnection = useSocket();
  const user = useSelector((state) => state.user);
  const activeConversation = useActiveConversation();

  function handleTyping() {
    // Send message is typing
    if (!typingTimeoutRef.current) {
      socketConnection.emit('user:typing', {
        userId: user?._id,
        otherUserId: activeConversation?.otherUser?._id,
        isTyping: true,
      });
    }

    // Reset the timeout if user keeps typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to emit "stopped typing" after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
      socketConnection.emit('user:typing', {
        userId: user?._id,
        otherUserId: activeConversation?.otherUser?._id,
        isTyping: false,
      });
    }, 2000);
  }

  return handleTyping;
}
